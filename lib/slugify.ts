// ─── Property Slug Generation & Parsing ─────────────────────────────────────
// Generates SEO-friendly slugs from property data and parses them for DB lookup.
//
// Slug pattern: {type}-{subtype}-in-{locality}-{city}-{state}-{shortId}
// Example:      commercial-warehouse-in-patancheru-hyderabad-telangana-a1b2c3

/**
 * Normalize a text string into a URL-safe slug segment.
 * - Lowercases
 * - Replaces spaces, underscores, and special chars with hyphens
 * - Collapses consecutive hyphens
 * - Trims leading/trailing hyphens
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")               // remove apostrophes
    .replace(/[&]/g, "and")             // & → and
    .replace(/[^\w\s-]/g, "")           // remove non-word chars (except spaces & hyphens)
    .replace(/[\s_]+/g, "-")            // spaces/underscores → hyphens
    .replace(/-+/g, "-")               // collapse consecutive hyphens
    .replace(/^-+|-+$/g, "");          // trim leading/trailing hyphens
}

/**
 * Get the short ID from a UUID (first 8 characters).
 * Used as a unique suffix in the slug.
 */
export function getShortId(uuid: string): string {
  // Remove hyphens and take first 8 chars for a reasonably unique suffix
  return uuid.replace(/-/g, "").slice(0, 8);
}

/**
 * Determine the human-readable property type label.
 */
function getTypeLabel(propertyType: string): string {
  const type = (propertyType || "").toLowerCase();
  switch (type) {
    case "commercial":
      return "commercial";
    case "apartment":
    case "house":
    case "villa":
    case "plot":

      return "residential";
    default:
      return type || "property";
  }
}

/**
 * Determine the subtype label.
 * For commercial: uses commercial_type (warehouse, office-space, etc.)
 * For residential: uses property_type itself (apartment, villa, house, plot)
 */
function getSubtypeLabel(propertyType: string, commercialType?: string | null): string {
  const type = (propertyType || "").toLowerCase();

  if (type === "commercial") {
    return commercialType ? slugify(commercialType) : "property";
  }

  // For residential types, the property_type IS the subtype
  if (["apartment", "house", "villa", "plot"].includes(type)) {
    return type;
  }

  return "property";
}

/**
 * Generate an SEO-friendly slug from property data.
 *
 * Pattern: {type}-{subtype}-in-{locality}-{city}-{state}-{shortId}
 * Example: commercial-warehouse-in-patancheru-hyderabad-telangana-a1b2c3
 */
export function generatePropertySlug(property: {
  id: string;
  property_type?: string | null;
  type?: string;
  commercial_type?: string | null;
  commercialType?: string | null;
  locality?: string | null;
  location?: string;
  city?: string | null;
  state?: string | null;
}): string {
  const pType = property.property_type || property.type || "property";
  const cType = property.commercial_type || property.commercialType || null;
  const locality = property.locality || property.location || "";
  const city = property.city || "hyderabad";
  const state = property.state || "telangana";
  const shortId = getShortId(property.id);

  const typeLabel = getTypeLabel(pType);
  const subtypeLabel = getSubtypeLabel(pType, cType);

  // Build slug parts
  const parts: string[] = [];

  // Type + Subtype
  if (typeLabel === subtypeLabel) {
    parts.push(slugify(typeLabel));
  } else {
    parts.push(slugify(typeLabel));
    parts.push(slugify(subtypeLabel));
  }

  // "in" + location
  parts.push("in");

  if (locality) {
    parts.push(slugify(locality));
  }

  parts.push(slugify(city));
  parts.push(slugify(state));

  // Unique suffix
  parts.push(shortId);

  return parts.join("-");
}

/**
 * Parse a property slug to extract the short ID for database lookup.
 * The short ID is always the last segment (8 hex characters).
 */
export function parsePropertySlug(slug: string): { shortId: string } {
  // The short ID is the last segment of the slug
  const parts = slug.split("-");
  const shortId = parts[parts.length - 1] || "";
  return { shortId };
}

/**
 * Check if a string looks like a UUID (used to detect old-format URLs).
 */
export function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Build the SEO page title from property data.
 * Format: "Commercial, Warehouse in Patancheru, Hyderabad, Telangana | Covnant Reality"
 */
export function buildPropertyPageTitle(property: {
  property_type?: string | null;
  type?: string;
  commercial_type?: string | null;
  commercialType?: string | null;
  locality?: string | null;
  location?: string;
  city?: string | null;
  state?: string | null;
}): string {
  const pType = property.property_type || property.type || "Property";
  const cType = property.commercial_type || property.commercialType || null;

  const typeLabel = capitalize(getTypeLabel(pType));
  const subtypeLabel = capitalize(getSubtypeLabel(pType, cType).replace(/-/g, " "));

  const locality = property.locality || property.location || "";
  const city = property.city || "Hyderabad";
  const state = property.state || "Telangana";

  // Build: "Commercial, Warehouse in Locality, City, State"
  let title = typeLabel;
  if (subtypeLabel.toLowerCase() !== typeLabel.toLowerCase()) {
    title += `, ${subtypeLabel}`;
  }

  title += " in ";
  if (locality) {
    title += `${capitalize(locality)}, `;
  }
  title += `${capitalize(city)}, ${capitalize(state)}`;

  return title;
}

/**
 * Build the SEO meta description from property data.
 */
export function buildPropertyMetaDescription(property: {
  property_type?: string | null;
  type?: string;
  commercial_type?: string | null;
  commercialType?: string | null;
  listing_type?: string | null;
  listingType?: string | null;
  locality?: string | null;
  location?: string;
  city?: string | null;
  price?: number | null;
}): string {
  const pType = property.property_type || property.type || "Property";
  const cType = property.commercial_type || property.commercialType || null;
  const lType = (property.listing_type || property.listingType || "sale").toLowerCase();
  const locality = property.locality || property.location || "";
  const city = property.city || "Hyderabad";

  const typeLabel = capitalize(getTypeLabel(pType));
  const subtypeLabel = capitalize(getSubtypeLabel(pType, cType).replace(/-/g, " "));
  const intent = lType === "rent" ? "Rent" : "Sale";

  let desc = `Explore this ${typeLabel} ${subtypeLabel} for ${intent}`;
  if (locality) {
    desc += ` in ${capitalize(locality)}, ${capitalize(city)}`;
  } else {
    desc += ` in ${capitalize(city)}`;
  }

  if (property.price) {
    const formatted = formatPrice(property.price);
    desc += ` at ${formatted}`;
  }

  desc += ". View photos, pricing, amenities & more on Covnant Reality.";

  return desc;
}

function capitalize(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lakh`;
  return `₹${price.toLocaleString("en-IN")}`;
}
