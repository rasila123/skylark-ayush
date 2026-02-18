import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asgkhwwlcvgbldhuvzkv.supabase.co';
const supabaseKey = 'sb_publishable_0CLHv-13aS1mbohVrGnNjA_szTF2wZJ';
export const supabase = createClient(supabaseUrl, supabaseKey);