import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { JsonLd, getRealEstateListingSchema } from "@/components/seo/JsonLd";
import { PropertyDetailClient } from "./PropertyDetailClient";

const BASE_URL = "https://www.covnantreality.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    if (!supabaseUrl || !supabaseKey) {
      return { title: "Property Details | Covnant Reality" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });

    const { data } = await supabase
      .from("properties")
      .select("title, description, property_type, listing_type, city, locality, address, price, image_urls")
      .eq("id", id)
      .maybeSingle();

    if (!data) {
      return { title: "Property Not Found | Covnant Reality" };
    }

    const title = `${data.title || "Property"} in ${data.locality || data.city || "Hyderabad"} | Covnant Reality`;
    const description = data.description
      ? data.description.slice(0, 160)
      : `${data.property_type || "Property"} for ${data.listing_type || "sale"} in ${data.locality || data.city || "Hyderabad"}. View details, photos, and pricing on Covnant Reality.`;

    const imageUrl = data.image_urls?.[0] || "/og-image.jpg";

    return {
      title,
      description,
      alternates: { canonical: `${BASE_URL}/property/${id}` },
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/property/${id}`,
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

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch property data for JSON-LD (best-effort, non-blocking)
  let schemaData = null;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      });

      const { data } = await supabase
        .from("properties")
        .select("title, description, price, city, locality, latitude, longitude")
        .eq("id", id)
        .maybeSingle();

      if (data) {
        schemaData = getRealEstateListingSchema({
          title: data.title || "Property",
          description: data.description || "",
          id,
          price: data.price,
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city || "Hyderabad",
          location: data.locality || "",
        });
      }
    }
  } catch {
    // Non-critical — continue without schema
  }

  return (
    <>
      {schemaData && <JsonLd data={schemaData} />}
      <PropertyDetailClient params={params} />
    </>
  );
}
