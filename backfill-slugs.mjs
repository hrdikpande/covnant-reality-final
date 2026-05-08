#!/usr/bin/env node
// ─── Backfill Property Slugs ────────────────────────────────────────────────
// Run this script AFTER applying 30_property_slugs.sql migration.
// Usage: node backfill-slugs.mjs

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

// ─── Slug generation (mirrors lib/slugify.ts) ───────────────────────────────

function slugify(text) {
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
  switch (type) {
    case "commercial": return "commercial";
    case "apartment":
    case "house":
    case "villa":
    case "plot":
    case "pg":
      return "residential";
    default:
      return type || "property";
  }
}

function getSubtypeLabel(propertyType, commercialType) {
  const type = (propertyType || "").toLowerCase();
  if (type === "commercial") {
    return commercialType ? slugify(commercialType) : "property";
  }
  if (["apartment", "house", "villa", "plot", "pg"].includes(type)) {
    return type;
  }
  return "property";
}

function generateSlug(property) {
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

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔍 Fetching properties without slugs...");

  const { data: properties, error } = await supabase
    .from("properties")
    .select("id, property_type, commercial_type, locality, city, state, slug")
    .is("slug", null);

  if (error) {
    console.error("❌ Error fetching properties:", error.message);
    process.exit(1);
  }

  if (!properties || properties.length === 0) {
    console.log("✅ All properties already have slugs. Nothing to do.");
    return;
  }

  console.log(`📝 Found ${properties.length} properties to backfill.\n`);

  let success = 0;
  let failed = 0;
  const slugSet = new Set();

  for (const property of properties) {
    let slug = generateSlug(property);

    // Handle duplicates by appending a counter
    let finalSlug = slug;
    let counter = 2;
    while (slugSet.has(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    slugSet.add(finalSlug);

    const { error: updateError } = await supabase
      .from("properties")
      .update({ slug: finalSlug })
      .eq("id", property.id);

    if (updateError) {
      console.error(`  ❌ ${property.id}: ${updateError.message}`);
      failed++;
    } else {
      console.log(`  ✅ ${property.id} → ${finalSlug}`);
      success++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log(`📊 Total:   ${properties.length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
