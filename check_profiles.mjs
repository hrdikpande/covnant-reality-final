import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bqkiaendfnsrsskfhzyw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxa2lhZW5kZm5zcnNza2Zoenl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NzkzMzQsImV4cCI6MjA4ODM1NTMzNH0.ErjuOl6l37c4hEbJaI4VwIqzEkLB4bVFAYyXNsKOINc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, email, role');
  console.log('Profiles:', profiles, pErr);
}

check();
