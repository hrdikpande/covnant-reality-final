// ─── JSON-LD Structured Data Component ──────────────────────────────────────
// Injects schema.org JSON-LD into the page <head> for rich search results.

import React from "react";

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
    name: "Covnant Reality",
    url: "https://www.covnantreality.com",
    logo: "https://www.covnantreality.com/logo.png",
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
  location?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `https://www.covnantreality.com/property/${property.id}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city || "Hyderabad",
      addressRegion: "Telangana",
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
          },
        }
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
      url: "https://www.covnantreality.com",
      logo: "https://www.covnantreality.com/logo.png",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Covnant Reality",
      url: "https://www.covnantreality.com",
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `https://www.covnantreality.com/blog/${post.slug}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      "@type": "Organization",
      name: post.authorName || "Covnant Reality",
      url: "https://www.covnantreality.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Covnant Reality",
      url: "https://www.covnantreality.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.covnantreality.com/logo.png",
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
