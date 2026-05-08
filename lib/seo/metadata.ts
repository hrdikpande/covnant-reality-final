// ─── Central SEO Metadata Configuration ─────────────────────────────────────
// Maps routes to their SEO metadata. Used by generateMetadata() in each page.

const BASE_URL = "https://www.covnantreality.com";
const BRAND = "Covnant Reality";
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;

export interface PageSEO {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  keywords?: string;
}

export const SEO_CONFIG: Record<string, PageSEO> = {
  home: {
    title: `${BRAND} – Commercial & Residential Properties in Hyderabad`,
    description:
      "Find the best commercial property, residential properties, warehouses, and plots in Hyderabad. Covnant Reality – Hyderabad's trusted real estate company.",
    canonicalUrl: BASE_URL,
    ogImage: OG_IMAGE,
    keywords:
      "commercial property hyderabad, residential properties hyderabad, warehouse hyderabad, plots hyderabad, real estate hyderabad, property in hyderabad",
  },
  commercial: {
    title: `Commercial Property in Hyderabad – Offices, Shops & IT Parks | ${BRAND}`,
    description:
      "Explore premium commercial property in Hyderabad – IT parks, retail spaces, co-working spaces, office buildings & more. Contact Covnant Reality today.",
    canonicalUrl: `${BASE_URL}/commercial-property-hyderabad`,
    ogImage: OG_IMAGE,
    keywords:
      "commercial property hyderabad, commercial space for sale hyderabad, office space hyderabad, it parks hyderabad, retail space hyderabad, co-working spaces hyderabad, commercial plots hyderabad",
  },
  residential: {
    title: `Residential Properties in Hyderabad – Flats, Villas & Apartments | ${BRAND}`,
    description:
      "Browse luxury apartments, gated communities, villas, and affordable housing in Hyderabad. RERA-approved residential projects by Covnant Reality.",
    canonicalUrl: `${BASE_URL}/residential-properties-hyderabad`,
    ogImage: OG_IMAGE,
    keywords:
      "residential properties hyderabad, hyderabad flats, luxury apartments hyderabad, villas hyderabad, gated community hyderabad, RERA approved projects hyderabad",
  },
  warehouse: {
    title: `Warehouse in Hyderabad – Industrial & Commercial Spaces | ${BRAND}`,
    description:
      "Looking for a warehouse in Hyderabad? Find industrial property, warehouses, and commercial land across all major business districts. Covnant Reality.",
    canonicalUrl: `${BASE_URL}/warehouse-hyderabad`,
    ogImage: OG_IMAGE,
    keywords:
      "warehouse in hyderabad, warehouse for rent hyderabad, warehouse for sale hyderabad, industrial property hyderabad, commercial land hyderabad",
  },
  plots: {
    title: `Plots & Land in Hyderabad – Commercial & Residential | ${BRAND}`,
    description:
      "Invest in plots and land in Hyderabad. Find commercial plots, residential plots, and farmhouse land at the best prices.",
    canonicalUrl: `${BASE_URL}/plots-land-hyderabad`,
    ogImage: OG_IMAGE,
    keywords:
      "plots hyderabad, commercial plots hyderabad, land investment hyderabad, residential plots hyderabad, farmhouse hyderabad",
  },
  propertyManagement: {
    title: `Property Management in Hyderabad – Expert Services | ${BRAND}`,
    description:
      "Professional property management services in Hyderabad. Rental management, tenant services, property maintenance, and real estate advisory by Covnant Reality.",
    canonicalUrl: `${BASE_URL}/property-management-hyderabad`,
    ogImage: OG_IMAGE,
    keywords:
      "property management hyderabad, rental property management hyderabad, real estate advisory services, property maintenance services, property leasing hyderabad",
  },
  about: {
    title: `About Us – ${BRAND} | Hyderabad's Trusted Real Estate Company`,
    description:
      "Learn about Covnant Reality – Hyderabad's leading real estate company specializing in commercial, residential, warehouse, and plot properties.",
    canonicalUrl: `${BASE_URL}/about`,
    ogImage: OG_IMAGE,
  },
  contact: {
    title: `Contact Us – ${BRAND} | Get in Touch`,
    description:
      "Contact Covnant Reality for commercial property, residential properties, warehouses, and plots in Hyderabad. Our experts are ready to help.",
    canonicalUrl: `${BASE_URL}/contact`,
    ogImage: OG_IMAGE,
  },
  search: {
    title: `Search Properties in Hyderabad | ${BRAND}`,
    description:
      "Search and find your perfect property in Hyderabad – apartments, villas, commercial spaces, warehouses, and plots. Advanced filters for every need.",
    canonicalUrl: `${BASE_URL}/search`,
    ogImage: OG_IMAGE,
  },
  blog: {
    title: `Real Estate Blog – Hyderabad Property Insights | ${BRAND}`,
    description:
      "Expert insights on Hyderabad real estate – commercial property, residential projects, warehouse investments, and market trends. Read our latest articles.",
    canonicalUrl: `${BASE_URL}/blog`,
    ogImage: OG_IMAGE,
    keywords:
      "hyderabad real estate blog, property investment hyderabad, real estate market hyderabad",
  },
  faq: {
    title: `Frequently Asked Questions | ${BRAND}`,
    description:
      "Find answers to common questions about buying, selling, and renting properties in Hyderabad with Covnant Reality.",
    canonicalUrl: `${BASE_URL}/faq`,
    ogImage: OG_IMAGE,
  },
};

/**
 * Generate Next.js Metadata object from SEO config
 */
export function buildMetadata(page: keyof typeof SEO_CONFIG) {
  const seo = SEO_CONFIG[page];
  if (!seo) return {};

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalUrl,
      type: "website" as const,
      siteName: BRAND,
      images: [
        {
          url: seo.ogImage || OG_IMAGE,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage || OG_IMAGE],
    },
  };
}

export { BASE_URL, BRAND, OG_IMAGE };
