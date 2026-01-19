import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

/**
 * Create a Supabase client for use in the browser (Client Components)
 * This client is safe to use in Client Components and will use the anon key
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Export a singleton instance for convenience
let browserClient: ReturnType<typeof createClient> | null = null;

export function getClient() {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
}
