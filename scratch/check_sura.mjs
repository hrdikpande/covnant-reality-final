import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const serviceKeyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const key = serviceKeyMatch ? serviceKeyMatch[1].trim() : keyMatch[1].trim();

const supabase = createClient(urlMatch[1].trim(), key);

async function check() {
  const { data: props, error } = await supabase
    .from('properties')
    .select('id, address, address_line, locality, city, state, pincode')
    .or('address.ilike.%sura%,address_line.ilike.%sura%')
    .limit(5);
    
  console.log("Properties with sura in address:");
  console.log(props);
}

check();
