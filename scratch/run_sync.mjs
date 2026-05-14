import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const serviceKeyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const key = serviceKeyMatch ? serviceKeyMatch[1].trim() : keyMatch[1].trim();

const supabase = createClient(urlMatch[1].trim(), key);

async function check() {
  const { data: locs, error } = await supabase
    .from('localities')
    .select('*')
    .in('pincode', ['501359', '501510', '501501', '501218']);
    
  console.log("Localities for these pincodes in DB:");
  console.log(locs);
}

check();
