
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables! The app may not function correctly.');
}

// Create client only if URL is present to avoid crash, or create with dummy values if needed
// Supabase createClient requires a valid URL, otherwise it throws.
// We'll export a safe proxy or null if missing, but that requires changing consumers.
// Easiest fix: Provide a fallback URL if missing to prevent crash, but Auth will fail (which is handled in UI).
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
