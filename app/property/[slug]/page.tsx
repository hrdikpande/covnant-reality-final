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
import { notFound, redirect } from "next/navigation";
import { BASE_URL } from "@/lib/seo/metadata";

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
 */
const PROPERTY_META_SELECT = `id, title, description, property_type, commercial_type, listing_type, city, locality, state, address, price, area_sqft, bedrooms, latitude, longitude, property_media(media_url, media_type), status`;

async function findProperty(slugOrId: string) {
  try {
    const supabase = getSupabase();
    if (!supabase) return null;

    // 1. If it looks like a UUID, look up directly by id
    if (isUUID(slugOrId)) {
      const { data } = await supabase
        .from("properties")
        .select(PROPERTY_META_SELECT)
        .eq("id", slugOrId)
        .maybeSingle();
      return data;
    }

    // 2. Try to extract the UUID from the slug
    const { shortId } = parsePropertySlug(slugOrId);
    
    // 3. Find by id prefix (GTE/LTE range to match UUID start)
    if (shortId && shortId.length === 8) {
      const { data: byPrefix } = await supabase
        .from("properties")
        .select(PROPERTY_META_SELECT)
        .gte("id", `${shortId}-0000-0000-0000-000000000000`)
        .lte("id", `${shortId}-ffff-ffff-ffff-ffffffffffff`)
        .maybeSingle();
      return byPrefix;
    }

    return null;
  } catch (error) {
    console.error("Error finding property:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await findProperty(slug);

    if (!data || data.status === 'expired' || data.status === 'sold' || data.status === 'draft') {
      return {
        title: { absolute: "Property Not Found | Covnant Reality" },
        robots: { index: false, follow: false }
      };
    }

    // If it was a UUID, we don't return full metadata here as it will redirect
    if (isUUID(slug)) {
      return { title: { absolute: "Redirecting..." } };
    }

    const generatedSlug = generatePropertySlug({
      id: data.id,
      property_type: data.property_type,
      commercial_type: data.commercial_type,
      locality: data.locality,
      city: data.city,
      state: data.state,
    });

    // SEO-optimized Title: "{Property Name} for Sale in {City} | Covnant Reality"
    // Some stored property titles already contain "for Rent"/"for Sale" —
    // skip re-appending the intent phrase in that case to avoid duplication.
    const intent = data.listing_type === 'rent' ? 'Rent' : 'Sale';
    const baseName = data.title || 'Property';
    const alreadyHasIntent = /\bfor\s+(rent|sale)\b/i.test(baseName);
    const title = alreadyHasIntent
      ? `${baseName} in ${data.city || 'Hyderabad'} | Covnant Reality`
      : `${baseName} for ${intent} in ${data.city || 'Hyderabad'} | Covnant Reality`;

    // SEO-optimized Description: Trimmed to 155 chars
    let description = data.description 
      ? data.description.substring(0, 155).trim() 
      : buildPropertyMetaDescription(data);
    
    if (data.description && data.description.length > 155) {
      description += "...";
    }

    const canonicalUrl = `${BASE_URL}/property/${generatedSlug}`;
    const firstMedia = data.property_media?.find((m: any) => m.media_type === 'image' || !m.media_type);
    const imageUrl = firstMedia?.media_url
      ? (firstMedia.media_url.startsWith('http') ? firstMedia.media_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-media/${firstMedia.media_url}`)
      : "/og-image.jpg";

    return {
      title: { absolute: title },
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
      robots: {
        index: true,
        follow: true,
      }
    };
  } catch (error) {
    return { title: "Property Details | Covnant Reality" };
  }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Handle UUID → slug redirect
  if (isUUID(slug)) {
    const data = await findProperty(slug);
    if (data) {
      const targetSlug = generatePropertySlug({
        id: data.id,
        property_type: data.property_type,
        commercial_type: data.commercial_type,
        locality: data.locality,
        city: data.city,
        state: data.state,
      });
      redirect(`/property/${targetSlug}`);
    } else {
      notFound();
    }
  }

  // 2. Fetch property data with 5xx protection
  let data: any = null;
  try {
    data = await findProperty(slug);
  } catch (error) {
    console.error("Server error fetching property:", error);
    // Graceful fail to 404 for SEO
    notFound();
  }

  // 3. Proper 404 handling for expired/sold/missing properties (Soft 404 fix)
  if (!data || data.status === 'expired' || data.status === 'sold' || data.status === 'draft') {
    notFound();
  }

  // 4. JSON-LD Structured Data
  let schemaData: any = null;
  let breadcrumbData: any = null;

  try {
    const pageTitle = buildPropertyPageTitle(data);
    const canonicalSlug = slug;

    const firstMedia = data.property_media?.find((m: any) => m.media_type === 'image' || !m.media_type);
    const imageUrl = firstMedia?.media_url
      ? (firstMedia.media_url.startsWith('http') ? firstMedia.media_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-media/${firstMedia.media_url}`)
      : `${BASE_URL}/og-image.jpg`;

    schemaData = getRealEstateListingSchema({
      title: data.title || pageTitle,
      description: data.description || "",
      id: canonicalSlug,
      price: data.price,
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city || "Hyderabad",
      location: data.locality || "",
      imageUrl: imageUrl,
    });

    breadcrumbData = getBreadcrumbSchema([
      { name: "Home", url: BASE_URL },
      { name: data.property_type === "commercial" ? "Commercial Property" : "Properties", url: data.property_type === "commercial" ? `${BASE_URL}/commercial-property-hyderabad` : `${BASE_URL}/search` },
      { name: data.title || pageTitle, url: `${BASE_URL}/property/${canonicalSlug}` },
    ]);
  } catch (e) {
    // Non-critical
  }

  return (
    <>
      {schemaData && <JsonLd data={schemaData} />}
      {breadcrumbData && <JsonLd data={breadcrumbData} />}
      <PropertyDetailClient params={params} />
    </>
  );
}
