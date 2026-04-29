import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPropertyTitle(data: {
  title?: string;
  property_type?: string;
  type?: string;
  commercial_type?: string | null;
  commercialType?: string | null;
  listing_type?: string;
  listingType?: string;
}) {
  const pType = (data.property_type || data.type || "").toLowerCase();
  const cType = data.commercial_type || data.commercialType || "";
  const lType = (data.listing_type || data.listingType || "").toLowerCase();
  
  let intent = "";
  if (lType === "sell") intent = "Sale";
  else if (lType === "rent") intent = "Rent";

  // Commercial Formatting
  if (pType === "commercial") {
    const typeStr = "Commercial";
    const subtype = cType ? `, ${cType}` : "";
    if (intent) return `${typeStr}${subtype}, for ${intent}`;
    return `${typeStr}${subtype}`;
  }

  // Residential Formatting
  if (["apartment", "house", "villa", "plot", "residential"].includes(pType)) {
    const typeStr = "Residential";
    let subtype = "";
    if (pType !== "residential") {
        subtype = `, ${pType.charAt(0).toUpperCase() + pType.slice(1)}`;
    }
    if (intent) return `${typeStr}${subtype}, for ${intent}`;
    return `${typeStr}${subtype}`;
  }

  // Fallback to title or original format
  if (data.title && data.title.trim().length > 0) return data.title;
  return "Property Details";
}
