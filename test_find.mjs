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

async function testFindProperty(slugOrId) {
  console.log(`\nTesting: ${slugOrId}`);
  
  // 1. UUID check
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
  if (isUUID) {
    const { data } = await supabase
      .from("properties")
      .select("id, title, status")
      .eq("id", slugOrId)
      .maybeSingle();
    console.log("UUID Search Result:", data);
    return;
  }

  // 2. Slug check
  const parts = slugOrId.split("-");
  const shortId = parts[parts.length - 1];
  console.log(`Extracted shortId: ${shortId}`);

  if (shortId && shortId.length >= 6) {
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, status")
      .like("id", `${shortId.slice(0, 8)}%`)
      .limit(1)
      .maybeSingle();
    
    if (error) console.error("Error:", error);
    console.log("Slug Search Result:", data);
  } else {
    console.log("Invalid shortId");
  }
}

async function run() {
  // Test with one of the IDs I saw
  const testId = "41d17e48-c7bb-4b52-943b-d379ed40311e";
  await testFindProperty(testId);
  
  // Test with the slug corresponding to it
  // commercial-warehouse-in-bramhanapally-hyderabad-telangana-41d17e48
  await testFindProperty("commercial-warehouse-in-bramhanapally-hyderabad-telangana-41d17e48");
}

run();
