import { createAdminClient } from '@/lib/supabase/server';
import type { DiscoveryResult } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface SaveDiscoveriesResult {
  new: number;
  existing: number;
  errors: number;
  details: {
    newProducts: string[];
    existingProducts: string[];
    errorMessages: string[];
  };
}

export interface SaveDiscoveriesOptions {
  sourceId: string;      // ID of the source in the `sources` table
  sourceName: string;    // Display name for logging
  autoApproveThreshold?: number; // Confidence score threshold for auto-approval (default: 85)
}

// ============================================================================
// Main Function
// ============================================================================

export async function saveDiscoveries(
  discoveries: DiscoveryResult[],
  options: SaveDiscoveriesOptions
): Promise<SaveDiscoveriesResult> {
  const supabase = createAdminClient();
  const { sourceId, sourceName, autoApproveThreshold = 85 } = options;

  const result: SaveDiscoveriesResult = {
    new: 0,
    existing: 0,
    errors: 0,
    details: {
      newProducts: [],
      existingProducts: [],
      errorMessages: [],
    },
  };

  console.log(`[SaveDiscoveries] Processing ${discoveries.length} discoveries from ${sourceName}...`);

  for (const discovery of discoveries) {
    try {
      // Normalize name for comparison
      const normalizedName = normalizeProductName(discovery.name);

      // Check if product already exists (by normalized name)
      const { data: existingProducts, error: searchError } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${normalizedName.slice(0, 50)}%`)
        .limit(10);

      if (searchError) {
        throw new Error(`Search error: ${searchError.message}`);
      }

      // Check for duplicates using fuzzy matching
      const products = existingProducts as Array<{ id: string; name: string }> | null;
      const duplicate = products?.find((p) =>
        isSameProduct(p.name, discovery.name)
      );

      if (duplicate) {
        // Product already exists - link to source
        await linkProductSource(supabase, duplicate.id, sourceId, discovery);
        result.existing++;
        result.details.existingProducts.push(discovery.name);
        continue;
      }

      // Look up or create brand
      const brandId = await getOrCreateBrand(supabase, discovery.brand);

      // Determine status based on confidence score
      const status = discovery.confidence_score >= autoApproveThreshold
        ? 'approved'
        : 'pending_review';

      // Insert new product using raw query to avoid type issues
      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert({
          name: discovery.name,
          brand_id: brandId,
          collaborator: discovery.collaborator || null,
          category: discovery.category,
          sku: discovery.sku || null,
          description: null,
          image_url: discovery.image_url || null,
          release_date: discovery.release_date || null,
          retail_price: discovery.retail_price || null,
          confidence_score: discovery.confidence_score,
          is_limited_edition: discovery.is_limited_edition,
          status: status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
          approved_by: null,
          hype_score_updated_at: null,
        } as never)
        .select('id')
        .single();

      if (insertError) {
        throw new Error(`Insert error: ${insertError.message}`);
      }

      const productId = (newProduct as { id: string } | null)?.id;
      if (!productId) {
        throw new Error('Failed to get new product ID');
      }

      // Link product to source
      await linkProductSource(supabase, productId, sourceId, discovery);

      result.new++;
      result.details.newProducts.push(discovery.name);

      console.log(`[SaveDiscoveries] Added: ${discovery.name} (${status})`);

    } catch (error) {
      result.errors++;
      const message = error instanceof Error ? error.message : 'Unknown error';
      result.details.errorMessages.push(`${discovery.name}: ${message}`);
      console.error(`[SaveDiscoveries] Error processing "${discovery.name}":`, message);
    }
  }

  console.log(`[SaveDiscoveries] Complete: ${result.new} new, ${result.existing} existing, ${result.errors} errors`);

  return result;
}

// ============================================================================
// Helper Functions
// ============================================================================

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isSameProduct(existingName: string, newName: string): boolean {
  const existingNorm = normalizeProductName(existingName);
  const newNorm = normalizeProductName(newName);

  // Exact match
  if (existingNorm === newNorm) return true;

  // Check if one contains the other (for variants like "Nike Air Max 1" vs "Nike Air Max 1 'Panda'")
  const shorterName = existingNorm.length < newNorm.length ? existingNorm : newNorm;
  const longerName = existingNorm.length < newNorm.length ? newNorm : existingNorm;

  if (longerName.includes(shorterName) && shorterName.length > 15) {
    return true;
  }

  // Check first 5 words match
  const existingWords = existingNorm.split(' ').slice(0, 5).join(' ');
  const newWords = newNorm.split(' ').slice(0, 5).join(' ');

  if (existingWords === newWords && existingWords.length > 10) {
    return true;
  }

  return false;
}

async function getOrCreateBrand(
  supabase: ReturnType<typeof createAdminClient>,
  brandName: string
): Promise<string | null> {
  if (!brandName || brandName === 'Unknown') {
    return null;
  }

  const normalizedBrand = brandName.trim();
  const slug = normalizedBrand.toLowerCase().replace(/\s+/g, '-');

  // Check if brand exists
  const { data: existingBrand } = await supabase
    .from('brands')
    .select('id')
    .eq('slug', slug)
    .single();

  const existingId = (existingBrand as { id: string } | null)?.id;
  if (existingId) {
    return existingId;
  }

  // Create new brand
  const { data: newBrand, error } = await supabase
    .from('brands')
    .insert({
      name: normalizedBrand,
      slug,
      heat_score: 50,
    } as never)
    .select('id')
    .single();

  if (error) {
    console.warn(`[SaveDiscoveries] Could not create brand "${brandName}": ${error.message}`);
    return null;
  }

  const newId = (newBrand as { id: string } | null)?.id;
  if (newId) {
    console.log(`[SaveDiscoveries] Created new brand: ${brandName}`);
  }
  return newId || null;
}

async function linkProductSource(
  supabase: ReturnType<typeof createAdminClient>,
  productId: string,
  sourceId: string,
  discovery: DiscoveryResult
): Promise<void> {
  // Check if link already exists
  const { data: existingLink } = await supabase
    .from('product_sources')
    .select('id')
    .eq('product_id', productId)
    .eq('source_id', sourceId)
    .single();

  if ((existingLink as { id: string } | null)?.id) {
    return; // Already linked
  }

  const { error } = await supabase
    .from('product_sources')
    .insert({
      product_id: productId,
      source_id: sourceId,
      external_url: discovery.source_url,
      raw_data: discovery.raw_data || null,
    } as never);

  if (error) {
    console.warn(`[SaveDiscoveries] Could not link product to source: ${error.message}`);
  }
}

// ============================================================================
// Utility: Ensure Source Exists
// ============================================================================

export async function ensureSourceExists(
  scraperId: string,
  sourceName: string,
  sourceUrl: string,
  sourceType: 'calendar' | 'social' | 'resale' | 'trends' | 'retailer' = 'calendar'
): Promise<string> {
  const supabase = createAdminClient();

  // Check if source exists by scraper_id
  const { data: existingSource } = await supabase
    .from('sources')
    .select('id')
    .eq('scraper_id', scraperId)
    .single();

  const existingId = (existingSource as { id: string } | null)?.id;
  if (existingId) {
    return existingId;
  }

  // Create new source
  const { data: newSource, error } = await supabase
    .from('sources')
    .insert({
      name: sourceName,
      type: sourceType,
      url: sourceUrl,
      scraper_id: scraperId,
      scraper_config: {},
      check_interval_minutes: 360,
      is_active: true,
      reliability_score: 80,
    } as never)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create source: ${error.message}`);
  }

  const newId = (newSource as { id: string } | null)?.id;
  if (!newId) {
    throw new Error('Failed to get new source ID');
  }

  console.log(`[SaveDiscoveries] Created source: ${sourceName} (${newId})`);
  return newId;
}
