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

async function debugProperty() {
  const shortId = "33cfcce3";
  const startUuid = `${shortId}-0000-0000-0000-000000000000`;
  const endUuid = `${shortId}-ffff-ffff-ffff-ffffffffffff`;
  
  console.log(`Searching for shortId: ${shortId}`);
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, status, property_type, city, locality")
    .gte("id", startUuid)
    .lte("id", endUuid)
    .maybeSingle();
  
  if (error) console.error("Error:", error);
  console.log("Result:", data);

  // If not found, check if it's a suffix match instead of prefix
  if (!data) {
    console.log("Not found by prefix. Checking all properties for suffix match...");
    const { data: all } = await supabase.from("properties").select("id").limit(1000);
    const match = all.find(p => p.id.replace(/-/g, "").startsWith(shortId));
    if (match) {
        console.log("Found match by manual prefix scan:", match.id);
    } else {
        console.log("No match found at all.");
    }
  }
}

debugProperty();
