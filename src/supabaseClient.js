import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asgkhwwlcvgbldhuvzkv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZ2tod3dsY3ZnYmxkaHV2emt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzk3NzQsImV4cCI6MjA4NjkxNTc3NH0.DdF4j9gmi6hQYylbD5DtgXzLrTqnyM8pGFpIcWA3C6g';
export const supabase = createClient(supabaseUrl, supabaseKey);