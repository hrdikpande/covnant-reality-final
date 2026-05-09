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

function getNextHexPrefix(prefix) {
  const hex = "0123456789abcdef";
  let lastChar = prefix[prefix.length - 1];
  let index = hex.indexOf(lastChar);
  if (index === 15) {
    // If it's 'f', we need to overflow, but for 8-char prefix this is rare
    // For simplicity, let's assume it's not 'ffffffff'
    return prefix.slice(0, -1) + 'g'; // This won't work for UUID types
  }
  return prefix.slice(0, -1) + hex[index + 1];
}

async function testFindPropertyRange(slugOrId) {
  console.log(`\nTesting Range Search: ${slugOrId}`);
  
  const parts = slugOrId.split("-");
  const shortId = parts[parts.length - 1];
  
  if (shortId && shortId.length === 8) {
    const startUuid = `${shortId}-0000-0000-0000-000000000000`;
    const nextPrefix = getNextHexPrefix(shortId);
    const endUuid = `${nextPrefix}-0000-0000-0000-000000000000`;
    
    console.log(`Range: [${startUuid}, ${endUuid})`);

    const { data, error } = await supabase
      .from("properties")
      .select("id, title, status")
      .gte("id", startUuid)
      .lt("id", endUuid)
      .maybeSingle();
    
    if (error) console.error("Error:", error);
    console.log("Range Search Result:", data);
  }
}

async function run() {
  await testFindPropertyRange("commercial-warehouse-in-bramhanapally-hyderabad-telangana-41d17e48");
}

run();
