// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mimnhwncoasghrgmdiee.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbW5od25jb2FzZ2hyZ21kaWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMzQzMjcsImV4cCI6MjA0MzcxMDMyN30.I-KFxYe163kI4UF2mfuWDNsoyLhHJYG_ZxtSKhCWC5I';
export const supabase = createClient(supabaseUrl, supabaseKey);
