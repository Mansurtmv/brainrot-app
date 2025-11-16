import { createClient } from '@supabase/supabase-js'

// Dieser Code ist sicher und liest aus deiner .env Datei
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)