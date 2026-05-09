import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Simple env loader
const envContent = fs.readFileSync(".env", "utf8");
const env = {};
envContent.split("\n").forEach(line => {
  const [key, ...value] = line.split("=");
  if (key && value) env[key.trim()] = value.join("=").trim().replace(/^"|"$/g, "");
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFindPropertyLte(slugOrId) {
  console.log(`\nTesting GTE/LTE Search: ${slugOrId}`);
  
  const parts = slugOrId.split("-");
  const shortId = parts[parts.length - 1];
  
  if (shortId && shortId.length === 8) {
    const startUuid = `${shortId}-0000-0000-0000-000000000000`;
    const endUuid = `${shortId}-ffff-ffff-ffff-ffffffffffff`;
    
    console.log(`Range: [${startUuid}, ${endUuid}]`);

    const { data, error } = await supabase
      .from("properties")
      .select("id, title, status")
      .gte("id", startUuid)
      .lte("id", endUuid)
      .maybeSingle();
    
    if (error) console.error("Error:", error);
    console.log("GTE/LTE Search Result:", data);
  }
}

async function run() {
  await testFindPropertyLte("commercial-warehouse-in-bramhanapally-hyderabad-telangana-41d17e48");
}

run();
