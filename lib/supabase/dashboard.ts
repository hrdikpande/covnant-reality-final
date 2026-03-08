import { createClient } from "@/lib/supabase/client";
import type {
    SavedPropertyRow,
    SavedSearch,
    SiteVisitRow,
    LeadRow,
    AlertRow,
    UserProfile,
} from "@/components/dashboard/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function supabase() {
    return createClient();
}

function getPublicUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    const { data } = supabase().storage.from("property-media").getPublicUrl(path);
    return data.publicUrl;
}

// ─── Saved Properties ───────────────────────────────────────────────────────

export async function fetchSavedProperties(): Promise<SavedPropertyRow[]> {
    const { data, error } = await supabase()
        .from("saved_properties")
        .select(`
            id,
            property_id,
            created_at,
            property:properties (
                id,
                title,
                description,
                listing_type,
                property_type,
                price,
                area_sqft,
                bedrooms,
                bathrooms,
                furnishing,
                address,
                city,
                status,
                is_verified,
                created_at,
                property_media ( media_url, media_type )
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[Dashboard] fetchSavedProperties error:", error.message);
        return [];
    }

    const rows = (data ?? []) as unknown as SavedPropertyRow[];
    return rows.map(row => ({
        ...row,
        property: {
            ...row.property,
            property_media: (row.property.property_media || []).map(m => ({
                ...m,
                media_url: getPublicUrl(m.media_url)
            }))
        }
    }));
}

// ─── Saved Searches ─────────────────────────────────────────────────────────

export async function fetchSavedSearches(): Promise<SavedSearch[]> {
    const { data, error } = await supabase()
        .from("saved_searches")
        .select("id, label, filters, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[Dashboard] fetchSavedSearches error:", error.message);
        return [];
    }
    return (data ?? []) as SavedSearch[];
}

// ─── Site Visits (Bookings) ─────────────────────────────────────────────────

export async function fetchSiteVisits(): Promise<SiteVisitRow[]> {
    const { data, error } = await supabase()
        .from("site_visits")
        .select(`
            id,
            property_id,
            visit_date,
            visit_time,
            status,
            created_at,
            property:properties (
                id,
                title,
                property_media ( media_url, media_type )
            ),
            agent:profiles!site_visits_agent_id_fkey (
                id,
                full_name,
                phone,
                email
            )
        `)
        .order("visit_date", { ascending: false });

    if (error) {
        console.error("[Dashboard] fetchSiteVisits error:", error.message);
        return [];
    }

    const rows = (data ?? []) as unknown as SiteVisitRow[];
    return rows
        .filter(row => !!row.property)
        .map(row => ({
            ...row,
            property: {
                ...row.property,
                property_media: (row.property.property_media || []).map(m => ({
                    ...m,
                    media_url: getPublicUrl(m.media_url)
                }))
            }
        }));
}

// ─── Leads ──────────────────────────────────────────────────────────────────

export async function fetchLeads(): Promise<LeadRow[]> {
    const { data, error } = await supabase()
        .from("leads")
        .select(`
            id,
            source,
            status,
            created_at,
            property:properties (
                id,
                title
            ),
            agent:profiles!leads_agent_id_fkey (
                id,
                full_name
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[Dashboard] fetchLeads error:", error.message);
        return [];
    }
    return (data ?? []) as unknown as LeadRow[];
}

// ─── Alerts ─────────────────────────────────────────────────────────────────

export async function fetchAlerts(): Promise<AlertRow[]> {
    const { data, error } = await supabase()
        .from("alerts")
        .select("id, title, frequency, active, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[Dashboard] fetchAlerts error:", error.message);
        return [];
    }
    return (data ?? []) as AlertRow[];
}

// Chats functionality fully removed.

// ─── Profile ────────────────────────────────────────────────────────────────

export async function fetchProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase().auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase()
        .from("profiles")
        .select("id, full_name, email, phone, city, avatar_url, is_verified, created_at")
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        console.error("[Dashboard] fetchProfile error:", error.message);
        return null;
    }
    return data as UserProfile | null;
}

export async function updateProfile(
    updates: Partial<Pick<UserProfile, "full_name" | "phone" | "city">>
): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await supabase().auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await supabase()
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

    if (error) {
        console.error("[Dashboard] updateProfile error:", error.message);
        return { success: false, error: error.message };
    }
    return { success: true };
}
