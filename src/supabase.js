import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://icdkeixkwbajefvkujcj.supabase.co'  // ganti dengan URL kamu
const SUPABASE_KEY = 'sb_publishable_RFBV-EFCEKjRhMTZ3JHKUQ_BNFZ27Z3'               // ganti dengan anon key kamu

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)