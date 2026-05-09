import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Simple env loader
const envContent = fs.readFileSync(".env", "utf8");
const env = {};
envContent.split("\n").forEach(line => {
  const [key, ...value] = line.split("=");
  if (key && value) env[key.trim()] = value.join("=").trim().replace(/^"|"$/g, "");
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditBlogs() {
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("id, title, content");

  if (error) {
    console.error("Error fetching blogs:", error);
    return;
  }

  console.log(`Auditing ${blogs.length} blogs...`);

  let fixNeeded = false;

  for (const blog of blogs) {
    const localhostMatches = blog.content.match(/http:\/\/localhost:3000/g);
    const propertiesMatches = blog.content.match(/\/properties\//g);
    const absoluteMatches = blog.content.match(/https?:\/\/covnantreality\.com/g);
    const uuidMatches = blog.content.match(/\/property\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g);

    if (localhostMatches || propertiesMatches || absoluteMatches || uuidMatches) {
      fixNeeded = true;
      console.log(`\nBlog ID: ${blog.id} - ${blog.title}`);
      if (localhostMatches) console.log(`  - Found ${localhostMatches.length} localhost links`);
      if (propertiesMatches) console.log(`  - Found ${propertiesMatches.length} /properties/ links`);
      if (absoluteMatches) console.log(`  - Found ${absoluteMatches.length} absolute domain links`);
      if (uuidMatches) console.log(`  - Found ${uuidMatches.length} UUID property links (Legacy)`);
    }
  }

  if (!fixNeeded) {
    console.log("\nNo broken links found in audited blogs.");
  }
}

auditBlogs();
