import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function run() {
  const { data: props, error } = await supabase
    .from('properties')
    .select('id, address_line, city_id, locality, pincode, locality_id, status')
    .not('pincode', 'is', null)
    .neq('pincode', '');
    
  if (error) {
    console.error(error);
    return;
  }
  
  console.log(`Found ${props.length} properties with non-empty pincodes.`);
  
  const { data: locs, error: locErr } = await supabase
    .from('localities')
    .select('id, city_id, name, pincode');
    
  if (locErr) {
    console.error(locErr);
    return;
  }
  console.log(`Found ${locs.length} localities.`);
  
  // Find which properties have no corresponding locality in the localities table
  const locSet = new Set(locs.map(l => `${l.city_id}_${l.pincode?.trim()}`));
  
  const missing = [];
  for (const p of props) {
    const key = `${p.city_id}_${p.pincode?.trim()}`;
    if (!locSet.has(key)) {
      missing.push(p);
    }
  }
  
  console.log(`There are ${missing.length} properties that refer to a (city_id, pincode) NOT present in localities table!`);
  
  const missingSummary = {};
  for (const m of missing) {
    const key = `${m.pincode?.trim()} - ${m.locality}`;
    missingSummary[key] = (missingSummary[key] || 0) + 1;
  }
  
  console.log("Missing combinations:");
  console.log(missingSummary);
  
  // Check the specific ones user mentioned
  const specific = props.filter(p => ['thukkuguda', 'tukkuguda', 'adibatla'].includes(p.locality?.toLowerCase()?.trim()));
  console.log(`Found ${specific.length} properties specifically matching thukkuguda, tukkuguda, or adibatla.`);
  for (const s of specific) {
    console.log(`- Prop ID: ${s.id}, Locality: ${s.locality}, Pincode: ${s.pincode}, CityID: ${s.city_id}, Linked Locality ID: ${s.locality_id}`);
  }
}

run();
