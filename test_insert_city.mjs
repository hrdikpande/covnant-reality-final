import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bqkiaendfnsrsskfhzyw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxa2lhZW5kZm5zcnNza2Zoenl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NzkzMzQsImV4cCI6MjA4ODM1NTMzNH0.ErjuOl6l37c4hEbJaI4VwIqzEkLB4bVFAYyXNsKOINc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data: states } = await supabase.from('states').select('id, name').limit(1);
  if (!states || states.length === 0) {
      console.log("No states found.");
      return;
  }
  const stateId = states[0].id;
  console.log("Using state ID:", stateId);

  const { error } = await supabase.from('cities').insert({ state_id: stateId, name: 'TestCity123' });
  console.log("Insert Error:", error);
}

testInsert();
