// Quick database connection test
// Run with: npx tsx scripts/test-db.ts

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env from .env.local manually
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      process.env[key] = valueParts.join('=');
    }
  }
});

async function testConnection() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('Connecting to Supabase...');
  console.log('URL:', url);

  const supabase = createClient(url, key);

  // Test 1: Query brands table
  console.log('\n--- Testing brands table ---');
  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('*')
    .limit(5);

  if (brandsError) {
    console.error('Error querying brands:', brandsError.message);
  } else {
    console.log(`Found ${brands?.length || 0} brands`);
    brands?.forEach(b => console.log(`  - ${b.name} (heat: ${b.heat_score})`));
  }

  // Test 2: Query retailers table
  console.log('\n--- Testing retailers table ---');
  const { data: retailers, error: retailersError } = await supabase
    .from('retailers')
    .select('name, slug, is_active')
    .limit(5);

  if (retailersError) {
    console.error('Error querying retailers:', retailersError.message);
  } else {
    console.log(`Found ${retailers?.length || 0} retailers`);
    retailers?.forEach(r => console.log(`  - ${r.name} (${r.slug})`));
  }

  // Test 3: Query sources table
  console.log('\n--- Testing sources table ---');
  const { data: sources, error: sourcesError } = await supabase
    .from('sources')
    .select('name, type, reliability_score')
    .limit(5);

  if (sourcesError) {
    console.error('Error querying sources:', sourcesError.message);
  } else {
    console.log(`Found ${sources?.length || 0} sources`);
    sources?.forEach(s => console.log(`  - ${s.name} (${s.type}, reliability: ${s.reliability_score})`));
  }

  console.log('\n✓ Database connection successful!');
}

testConnection().catch(console.error);
