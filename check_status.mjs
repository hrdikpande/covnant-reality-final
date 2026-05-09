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

async function checkStatus() {
  const { data: properties } = await supabase
    .from("properties")
    .select("id, status")
    .limit(10);

  console.log("Sample property statuses:");
  properties.forEach(p => console.log(`ID: ${p.id}, Status: "${p.status}"`));
}

checkStatus();
