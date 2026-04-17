import { createClient } from '@supabase/supabase-js';

// VITE_ environment variables are automatically loaded by Vite.
// We fallback to the hardcoded keys strictly for ease of use in local dev if .env isn't set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qlhvbseomssmwqpiwwxp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XPELc6l3vW4A8mOb47sipw_OOMm9Mg5';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
