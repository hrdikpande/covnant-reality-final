// ─── JSON-LD Structured Data Component ──────────────────────────────────────
// Injects schema.org JSON-LD into the page <head> for rich search results.

import React from "react";
import { BASE_URL } from "@/lib/seo/metadata";

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a <script type="application/ld+json"> tag with the provided schema data.
 * Use this in server components for SSR-friendly structured data.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Pre-built Schema Generators ────────────────────────────────────────────

/**
 * RealEstateAgent schema for the homepage / about page
 */
export function getRealEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${BASE_URL}/#organization`,
    name: "Covnant Reality",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: "Hyderabad",
    },
    description:
      "Leading real estate company in Hyderabad offering commercial property, residential properties, warehouses, and plots.",
    knowsAbout: [
      "Commercial Property in Hyderabad",
      "Residential Properties in Hyderabad",
      "Warehouses and Industrial Property in Hyderabad",
      "Plots and Land in Hyderabad",
      "Property Management in Hyderabad",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Property Services",
      itemListElement: [
        { "@type": "Service", name: "Commercial Property", url: `${BASE_URL}/commercial-property-hyderabad` },
        { "@type": "Service", name: "Residential Properties", url: `${BASE_URL}/residential-properties-hyderabad` },
        { "@type": "Service", name: "Warehouses", url: `${BASE_URL}/warehouse-hyderabad` },
        { "@type": "Service", name: "Plots & Land", url: `${BASE_URL}/plots-land-hyderabad` },
        { "@type": "Service", name: "Property Management", url: `${BASE_URL}/property-management-hyderabad` },
      ],
    },
    // No verified telephone, street address, geo-coordinates, or social
    // profiles are available yet — the Contact/Privacy/Terms pages currently
    // show placeholder "New Delhi" details that contradict the Hyderabad
    // brand used everywhere else. Add those fields here once real, verified
    // business details are supplied (see audit notes).
    sameAs: [],
  };
}

/**
 * RealEstateListing schema for individual property pages
 */
export function getRealEstateListingSchema(property: {
  title: string;
  description: string;
  id: string;
  price?: number;
  latitude?: number | null;
  longitude?: number | null;
  city?: string;
  state?: string;
  location?: string;
  areaSqft?: number | null;
  bedrooms?: number | null;
  imageUrl?: string | null;
}) {
  const urlPath = `${BASE_URL}/property/${property.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: urlPath,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city || "Hyderabad",
      addressRegion: property.state || "Telangana",
      addressCountry: "IN",
      streetAddress: property.location || "",
    },
    ...(property.latitude && property.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: property.latitude,
            longitude: property.longitude,
          },
        }
      : {}),
    ...(property.price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: property.price,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    ...(property.areaSqft
      ? {
          floorSize: {
            "@type": "QuantitativeValue",
            value: property.areaSqft,
            unitCode: "FTK",
          },
        }
      : {}),
    ...(property.bedrooms
      ? { numberOfRooms: property.bedrooms }
      : {}),
    ...(property.imageUrl
      ? { image: property.imageUrl }
      : {}),
  };
}

/**
 * WebPage schema for SEO landing pages
 */
export function getWebPageSchema(page: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.name,
    description: page.description,
    url: page.url,
    publisher: {
      "@type": "Organization",
      name: "Covnant Reality",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Covnant Reality",
      url: BASE_URL,
    },
  };
}

/**
 * BlogPosting schema for blog articles
 */
export function getBlogPostingSchema(post: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    image: post.imageUrl || `${BASE_URL}/og-image.jpg`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      "@type": "Organization",
      name: post.authorName || "Covnant Reality",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Covnant Reality",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
  };
}

/**
 * BreadcrumbList schema for navigation context
 */
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
