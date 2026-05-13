// ─── Property Types ─────────────────────────────────────────────────────────

export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    area: number; // in sq ft
    area_value?: number;
    area_unit?: string;
    serial_number?: number;
    image: string;
    images: string[];
    videos: string[];
    badge?: PropertyBadge;
    type: PropertyType;
    listed: string; // ISO date string
    featured: boolean;
    verified?: boolean;
    status?: PropertyStatus;
    // Detail-page extras (populated by fetchPropertyById)
    furnishing?: string | null;
    floor?: number | null;
    totalFloors?: number | null;
    facing?: string | null;
    possessionStatus?: string | null;
    listingType?: "sell" | "rent";
    ownerId?: string | null;
    commercialType?: string | null;
    pricePerSqFt?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    slug?: string | null;
    pincode?: string | null;

    // Reviews
    rating?: number;
    reviewCount?: number;

    // Contact
    contactNumber?: string | null;
    whatsappNumber?: string | null;

    // Additional Fields
    amenities?: string[] | null;
    allowChat?: boolean;
    landmark?: string | null;
    floorPlans: string[];
}

export type PropertyStatus = "Pending Approval" | "Approved" | "Rejected";

export type PropertyType =
    | "apartment"
    | "house"
    | "villa"
    | "plot"
    | "commercial";

export type PropertyBadge =
    | "new"
    | "featured"
    | "hot"
    | "price-drop"
    | "sold"
    | "rent";

// ─── UI Component Types ─────────────────────────────────────────────────────

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export type BadgeVariant =
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "outline";

// ─── Project Types ──────────────────────────────────────────────────────────

export interface Project {
    id: string;
    name: string;
    builder: string;
    location: string;
    city: string;
    startingPrice: number;
    possessionStatus: string;
    reraBadge: string;
    image: string;
}

// ─── Database Project Types ─────────────────────────────────────────────────

export interface DbProject {
    id: string;
    builder_id: string;
    name: string;
    description: string | null;
    city: string;
    possession_status: string | null;
    rera_number: string | null;
    image_url: string | null;
    created_at: string;
}

export type UnitStatus = "available" | "blocked" | "sold";

export interface DbProjectUnit {
    id: string;
    project_id: string;
    unit_number: string;
    price: number;
    status: UnitStatus;
    area_sqft: number;
    bedrooms: number | null;
    created_at: string;
}

export interface BuilderStats {
    totalProjects: number;
    activeUnits: number;
    totalLeads: number;
    pipelineValue: number;
}

export interface BuilderAnalytics {
    projectViews: number;
    totalLeads: number;
    sellThroughRate: number; // percentage 0–100
    pipelineValue: number;
    monthlyData: { month: string; leads: number; conversions: number }[];
}

export interface LeadFunnelData {
    new: number;
    contacted: number;
    visited: number;
    closed: number;
}

// ─── Agent Types ────────────────────────────────────────────────────────────

export interface Agent {
    id: string;
    name: string;
    photo: string;
    experienceYears: number;
    rating: number; // e.g. 4.8
    reviews: number;
    operatingLocation: string;
}

// ─── Search Types (Supabase Edge Function) ──────────────────────────────────

export interface SearchProperty {
    id: string;
    owner_id: string;
    title: string;
    description: string;
    listing_type: "sell" | "rent";
    property_type: string;
    price: number;
    area_sqft: number;
    area_value?: number;
    area_unit?: string;
    bedrooms: number;
    bathrooms: number;
    furnishing: string | null;
    address: string;
    locality: string | null;
    city: string;
    state: string | null;
    status: string;
    is_verified: boolean;
    created_at: string;
    total_count: number;
    image_url?: string | null;
    serial_number?: number;
    commercial_type?: string | null;
    price_per_sqft?: number | null;
    slug?: string | null;

    // Reviews
    rating?: number;
    reviewCount?: number;
}

export interface SearchFilters {
    city?: string;
    cityId?: string;
    stateId?: string;
    localityId?: string;
    bedrooms?: number;
    listing_type?: string;
    property_type?: string;
    subtypes?: string[];
    is_verified?: boolean;
    sort_by?: "newest" | "price_low" | "price_high";
    agentId?: string;
    price_min?: number;
    price_max?: number;
    area_min?: number;
    area_max?: number;
    furnishing?: string;
    possession?: string;
    extra_locations?: string[];
}

// ─── Review Types ───────────────────────────────────────────────────────────

export interface PropertyReview {
    id: string;
    property_id: string;
    user_id: string;
    rating: number;
    comment: string | null;
    created_at: string;

    // Joined field from auth.users (usually mapped by the client)
    user_name?: string;
}

// ─── Blog Types ─────────────────────────────────────────────────────────────

export type BlogStatus = "draft" | "published";

export interface Blog {
    id: string;
    title: string;
    slug: string;
    meta_title: string | null;
    meta_description: string | null;
    content: string;
    excerpt: string | null;
    focus_keyword: string | null;
    keywords: string[] | null;
    status: BlogStatus;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    og_image: string | null;
    word_count: number;
    reading_time: number;
    seo_score: number;
    schema_markup: any | null; // JSONB
}

export interface BlogProperty {
    blog_id: string;
    property_id: string;
    anchor_text: string | null;
}

export interface BlogImage {
    id: string;
    blog_id: string;
    url: string;
    alt_text: string;
    caption: string | null;
    width: number | null;
    height: number | null;
}
