import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bqkiaendfnsrsskfhzyw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxa2lhZW5kZm5zcnNza2Zoenl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NzkzMzQsImV4cCI6MjA4ODM1NTMzNH0.ErjuOl6l37c4hEbJaI4VwIqzEkLB4bVFAYyXNsKOINc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: states, error: statesErr } = await supabase.from('states').select('*');
  console.log('States:', states?.length, statesErr);
  
  if (states?.length > 0) {
      const { data: cities, error: citiesErr } = await supabase.from('cities').select('*').eq('state_id', states[0].id);
      console.log('Cities for state', states[0].name, ':', cities?.length, citiesErr);
  }
}

check();
