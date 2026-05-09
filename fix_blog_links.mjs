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

// Helper function to slugify (copied from lib/slugify.ts logic)
function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[&]/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getShortId(uuid) {
  return uuid.replace(/-/g, "").slice(0, 8);
}

function getTypeLabel(propertyType) {
  const type = (propertyType || "").toLowerCase();
  if (type === "commercial") return "commercial";
  if (["apartment", "house", "villa", "plot"].includes(type)) return "residential";
  return type || "property";
}

function getSubtypeLabel(propertyType, commercialType) {
  const type = (propertyType || "").toLowerCase();
  if (type === "commercial") return commercialType ? slugify(commercialType) : "property";
  if (["apartment", "house", "villa", "plot"].includes(type)) return type;
  return "property";
}

function generatePropertySlug(property) {
  const pType = property.property_type || "property";
  const cType = property.commercial_type || null;
  const locality = property.locality || "";
  const city = property.city || "hyderabad";
  const state = property.state || "telangana";
  const shortId = getShortId(property.id);

  const typeLabel = getTypeLabel(pType);
  const subtypeLabel = getSubtypeLabel(pType, cType);

  const parts = [];
  if (typeLabel === subtypeLabel) {
    parts.push(slugify(typeLabel));
  } else {
    parts.push(slugify(typeLabel));
    parts.push(slugify(subtypeLabel));
  }
  parts.push("in");
  if (locality) parts.push(slugify(locality));
  parts.push(slugify(city));
  parts.push(slugify(state));
  parts.push(shortId);

  return parts.join("-");
}

function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

async function fixBlogLinks() {
  console.log("Fetching live approved properties...");
  const { data: properties, error: pError } = await supabase
    .from("properties")
    .select("id, property_type, commercial_type, locality, city, state, status")
    .eq("status", "approved");

  if (pError) {
    console.error("Error fetching properties:", pError);
    return;
  }

  const validIds = new Set();
  const validSlugs = new Set();
  const idToSlug = {};

  properties.forEach(p => {
    validIds.add(p.id.toLowerCase());
    const slug = generatePropertySlug(p);
    validSlugs.add(slug.toLowerCase());
    idToSlug[p.id.toLowerCase()] = slug;
  });

  console.log(`Loaded ${validIds.size} valid properties.`);

  console.log("Fetching blogs...");
  const { data: blogs, error: bError } = await supabase
    .from("blogs")
    .select("id, title, content");

  if (bError) {
    console.error("Error fetching blogs:", bError);
    return;
  }

  console.log(`Auditing ${blogs.length} blogs...`);

  for (const blog of blogs) {
    let newContent = blog.content;
    let changed = false;

    const linkRegex = /<a\s+[^>]*href="\/property\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    
    let match;
    const replacements = [];
    
    while ((match = linkRegex.exec(newContent)) !== null) {
      const fullMatch = match[0];
      const slugOrId = match[1].toLowerCase().replace(/\/$/, "");
      const anchorText = match[2];
      
      let isValid = false;
      let targetSlug = null;

      if (isUUID(slugOrId)) {
        if (validIds.has(slugOrId)) {
          isValid = true;
          targetSlug = idToSlug[slugOrId];
        }
      } else {
        if (validSlugs.has(slugOrId)) {
          isValid = true;
        } else {
          const parts = slugOrId.split("-");
          const shortId = parts[parts.length - 1];
          if (shortId && shortId.length === 8) {
             const fullId = [...validIds].find(id => id.replace(/-/g, "").startsWith(shortId));
             if (fullId) {
                isValid = true;
                targetSlug = idToSlug[fullId];
             }
          }
        }
      }

      if (!isValid) {
        replacements.push({ old: fullMatch, new: anchorText });
        changed = true;
      } else if (targetSlug && slugOrId !== targetSlug.toLowerCase()) {
        replacements.push({
          old: fullMatch,
          new: fullMatch.replace(`/property/${match[1]}`, `/property/${targetSlug}`)
        });
        changed = true;
      }
    }

    for (const rep of replacements) {
      newContent = newContent.replace(rep.old, rep.new);
    }

    if (changed) {
      console.log(`Updating Blog: ${blog.title}`);
      await supabase.from("blogs").update({ content: newContent }).eq("id", blog.id);
    }
  }

  console.log("\nFinal fix complete.");
}

fixBlogLinks();
