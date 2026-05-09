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

async function sampleBlogs() {
  const { data: blogs } = await supabase
    .from("blogs")
    .select("id, title, content")
    .limit(10);

  for (const blog of blogs) {
    console.log(`\nBlog: ${blog.title}`);
    const links = blog.content.match(/href="([^"]+)"/g);
    if (links) {
      console.log("Links found:");
      links.forEach(l => console.log(`  ${l}`));
    } else {
      console.log("No links found in content.");
    }
  }
}

sampleBlogs();
