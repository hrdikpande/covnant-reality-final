import { createClient } from "./client";

export interface OwnerDashboardStats {
    totalProperties: number;
    activeListings: number;
    pendingApproval: number;
    totalLeads: number;
}

export interface OwnerProperty {
    id: string;
    title: string;
    listing_type: string;
    property_type: string;
    price: number;
    city: string;
    status: string;
    created_at: string;
    image?: string | null;
    image_url?: { media_url: string }[];
}

export interface OwnerLead {
    id: string;
    name: string | null;
    phone: string | null;
    source: string;
    status: string;
    created_at: string;
    property: { id: string; title: string } | null;
}

export interface OwnerVisit {
    id: string;
    visit_date: string;
    visit_time: string;
    status: string;
    created_at: string;
    property: { id: string; title: string } | null;
    buyer: { full_name: string | null; phone: string | null } | null;
}


export async function getOwnerDashboardStats(ownerId: string): Promise<OwnerDashboardStats> {
    const supabase = createClient();

    // Properties fetch
    const { data: properties, error: propError } = await supabase
        .from("properties")
        .select("status, id")
        .eq("owner_id", ownerId);

    if (propError) {
        console.error("Error fetching owner properties:", propError);
        return { totalProperties: 0, activeListings: 0, pendingApproval: 0, totalLeads: 0 };
    }

    const approved = properties.filter((p) => p.status === "approved").length;
    const pending = properties.filter((p) => p.status === "pending").length;

    // Extract property ids to count leads
    const propertyIds = properties.map(p => p.id);
    let leadCount = 0;

    if (propertyIds.length > 0) {
        const { count, error: leadError } = await supabase
            .from("leads")
            .select("*", { count: 'exact', head: true })
            .in("property_id", propertyIds);

        if (!leadError) {
            leadCount = count ?? 0;
        }
    }

    return {
        totalProperties: properties.length,
        activeListings: approved,
        pendingApproval: pending,
        totalLeads: leadCount
    };
}

export async function getOwnerProperties(ownerId: string): Promise<OwnerProperty[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("properties")
        .select(`
            id,
            title,
            listing_type,
            property_type,
            price,
            city,
            status,
            created_at,
            image_url:property_media(media_url)
        `)
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching properties:", error);
        return [];
    }

    // Map the shape slightly to get the first image easily
    return (data || []).map((p) => {
        const raw = p as unknown as Record<string, unknown>;
        const imgUrl = raw.image_url as { media_url: string }[] | undefined;
        return {
            ...p,
            image: Array.isArray(imgUrl) && imgUrl.length > 0 ? imgUrl[0].media_url : null
        };
    }) as OwnerProperty[];
}




export async function getOwnerLeads(ownerId: string) {
    const supabase = createClient();

    // 1. First get all property IDs for this owner
    const { data: properties, error: propError } = await supabase
        .from("properties")
        .select("id")
        .eq("owner_id", ownerId);

    if (propError || !properties || properties.length === 0) {
        return [];
    }

    const propertyIds = properties.map(p => p.id);

    // 2. Fetch leads for those properties
    const { data: leads, error: leadError } = await supabase
        .from("leads")
        .select(`
            id,
            name,
            phone,
            source,
            status,
            created_at,
            property:properties(id, title)
        `)
        .in("property_id", propertyIds)
        .order("created_at", { ascending: false });

    if (leadError) {
        console.error("Error fetching owner leads:", leadError);
        return [];
    }

    return (leads || []).map((l) => {
        const raw = l as unknown as Record<string, unknown>;
        return {
            ...l,
            property: (Array.isArray(raw.property) ? raw.property[0] : raw.property) as { id: string; title: string } | null
        };
    }) as OwnerLead[];
}




export async function getOwnerVisits(ownerId: string): Promise<OwnerVisit[]> {
    const supabase = createClient();

    // 1. First get all property IDs for this owner
    const { data: properties, error: propError } = await supabase
        .from("properties")
        .select("id")
        .eq("owner_id", ownerId);

    if (propError || !properties || properties.length === 0) {
        return [];
    }

    const propertyIds = properties.map(p => p.id);

    // 2. Fetch site visits for those properties
    const { data: visits, error: visitError } = await supabase
        .from("site_visits")
        .select(`
            id,
            visit_date,
            visit_time,
            status,
            created_at,
            property:properties(id, title),
            buyer:profiles!site_visits_buyer_id_fkey(full_name, phone)
        `)
        .in("property_id", propertyIds)
        .order("visit_date", { ascending: false });

    if (visitError) {
        console.error("Error fetching owner site visits:", visitError);
        return [];
    }

    return (visits || []).map((v) => {
        const raw = v as unknown as Record<string, unknown>;
        return {
            ...v,
            property: (Array.isArray(raw.property) ? raw.property[0] : raw.property) as { id: string; title: string } | null,
            buyer: (Array.isArray(raw.buyer) ? raw.buyer[0] : raw.buyer) as { full_name: string | null; phone: string | null } | null
        };
    }) as OwnerVisit[];
}




export async function getOwnerProfile(ownerId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", ownerId)
        .single();

    if (error) {
        console.error("Error fetching owner profile:", error);
        return null;
    }

    return data;
}

export async function updateOwnerProfile(ownerId: string, updates: Record<string, unknown>) {
    const supabase = createClient();

    const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", ownerId);

    if (error) {
        console.error("Error updating owner profile:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function deleteOwnerProperty(propertyId: string, ownerId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    // 1. Fetch media paths to delete from storage
    const { data: mediaRows } = await supabase
        .from("property_media")
        .select("media_url")
        .eq("property_id", propertyId);

    if (mediaRows && mediaRows.length > 0) {
        const paths = mediaRows
            .map((m: { media_url: string }) => m.media_url)
            .filter((p: string) => p && !p.startsWith("http") && !p.startsWith("/"));
        
        if (paths.length > 0) {
            await supabase.storage.from("property-media").remove(paths);
        }
    }

    // 2. Delete media rows (DB)
    await supabase.from("property_media").delete().eq("property_id", propertyId);

    // 3. Delete property (guarded by owner_id so only the owner can delete)
    const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId)
        .eq("owner_id", ownerId);

    if (error) {
        console.error("Error deleting property:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
