import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjltysusmyloavyrzger.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqbHR5c3VzbXlsb2F2eXJ6Z2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1ODg0MzYsImV4cCI6MjA2OTE2NDQzNn0.SPonHnA2-CDXNJe8IU1IuDeHrxi9VhE3Q5XKinVEb4I';
export const supabase = createClient(supabaseUrl, supabaseKey);