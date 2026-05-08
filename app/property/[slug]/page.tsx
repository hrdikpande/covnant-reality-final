import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { JsonLd, getRealEstateListingSchema, getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { PropertyDetailClient } from "./PropertyDetailClient";
import {
  parsePropertySlug,
  buildPropertyPageTitle,
  buildPropertyMetaDescription,
  generatePropertySlug,
  isUUID,
} from "@/lib/slugify";
import { redirect } from "next/navigation";

const BASE_URL = "https://www.covnantreality.com";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/**
 * Find property by slug or by short ID suffix.
 * Supports both:
 *  - Full slug: "commercial-warehouse-in-patancheru-hyderabad-telangana-a1b2c3"
 *  - Legacy UUID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 */
async function findProperty(slugOrId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  // 1. If it looks like a UUID, look up directly by id
  if (isUUID(slugOrId)) {
    const { data } = await supabase
      .from("properties")
      .select("id, title, description, property_type, commercial_type, listing_type, city, locality, state, address, price, image_urls, area_sqft, bedrooms, latitude, longitude, slug")
      .eq("id", slugOrId)
      .maybeSingle();
    return data;
  }

  // 2. Try exact slug match first
  const { data: bySlug } = await supabase
    .from("properties")
    .select("id, title, description, property_type, commercial_type, listing_type, city, locality, state, address, price, image_urls, area_sqft, bedrooms, latitude, longitude, slug")
    .eq("slug", slugOrId)
    .maybeSingle();

  if (bySlug) return bySlug;

  // 3. Fallback: extract short ID and find by id prefix
  const { shortId } = parsePropertySlug(slugOrId);
  if (shortId && shortId.length >= 6) {
    const { data: byPrefix } = await supabase
      .from("properties")
      .select("id, title, description, property_type, commercial_type, listing_type, city, locality, state, address, price, image_urls, area_sqft, bedrooms, latitude, longitude, slug")
      .like("id", `${shortId.slice(0, 8)}%`)
      .limit(1)
      .maybeSingle();
    return byPrefix;
  }

  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await findProperty(slug);

    if (!data) {
      return { title: "Property Not Found | Covnant Reality" };
    }

    // If it was a UUID, redirect to the slug URL
    if (isUUID(slug) && data.slug) {
      return { title: "Redirecting..." };
    }

    const pageTitle = buildPropertyPageTitle({
      property_type: data.property_type,
      commercial_type: data.commercial_type,
      locality: data.locality,
      city: data.city,
      state: data.state,
    });

    const title = `${pageTitle} | Covnant Reality`;

    const description = buildPropertyMetaDescription({
      property_type: data.property_type,
      commercial_type: data.commercial_type,
      listing_type: data.listing_type,
      locality: data.locality,
      city: data.city,
      price: data.price,
    });

    const canonicalSlug = data.slug || generatePropertySlug({
      id: data.id,
      property_type: data.property_type,
      commercial_type: data.commercial_type,
      locality: data.locality,
      city: data.city,
      state: data.state,
    });

    const canonicalUrl = `${BASE_URL}/property/${canonicalSlug}`;
    const imageUrl = data.image_urls?.[0] || "/og-image.jpg";

    return {
      title,
      description,
      keywords: `${data.property_type || "property"} ${data.commercial_type || ""} ${data.locality || ""} ${data.city || "Hyderabad"} ${data.state || "Telangana"} real estate covnant reality`.trim(),
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "website",
        siteName: "Covnant Reality",
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: "Property Details | Covnant Reality" };
  }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Handle UUID → slug redirect
  if (isUUID(slug)) {
    const data = await findProperty(slug);
    if (data) {
      const targetSlug = data.slug || generatePropertySlug({
        id: data.id,
        property_type: data.property_type,
        commercial_type: data.commercial_type,
        locality: data.locality,
        city: data.city,
        state: data.state,
      });
      redirect(`/property/${targetSlug}`);
    }
  }

  // Fetch property data for JSON-LD (best-effort, non-blocking)
  let schemaData = null;
  let breadcrumbData = null;
  let propertyData: { id: string; slug?: string | null; property_type?: string | null; commercial_type?: string | null; locality?: string | null; city?: string | null; state?: string | null } | null = null;

  try {
    const data = await findProperty(slug);

    if (data) {
      propertyData = data;
      const pageTitle = buildPropertyPageTitle({
        property_type: data.property_type,
        commercial_type: data.commercial_type,
        locality: data.locality,
        city: data.city,
        state: data.state,
      });

      const canonicalSlug = data.slug || slug;

      schemaData = getRealEstateListingSchema({
        title: pageTitle,
        description: data.description || "",
        id: canonicalSlug,
        price: data.price,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city || "Hyderabad",
        location: data.locality || "",
        useSlugUrl: true,
      });

      breadcrumbData = getBreadcrumbSchema([
        { name: "Home", url: BASE_URL },
        { name: data.property_type === "commercial" ? "Commercial Property" : "Properties", url: data.property_type === "commercial" ? `${BASE_URL}/commercial-property-hyderabad` : `${BASE_URL}/search` },
        { name: pageTitle, url: `${BASE_URL}/property/${canonicalSlug}` },
      ]);
    }
  } catch {
    // Non-critical — continue without schema
  }

  return (
    <>
      {schemaData && <JsonLd data={schemaData} />}
      {breadcrumbData && <JsonLd data={breadcrumbData} />}
      <PropertyDetailClient params={params} />
    </>
  );
}
