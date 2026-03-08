import { createClient } from "@/lib/supabase/client";
import type { DbProject, DbProjectUnit, BuilderStats, BuilderAnalytics, LeadFunnelData, UnitStatus } from "@/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function supabase() {
    return createClient();
}

async function currentUserId(): Promise<string | null> {
    const { data: { user } } = await supabase().auth.getUser();
    return user?.id ?? null;
}

async function logActivity(
    userId: string,
    action: string,
    entityType: string,
    entityId: string
): Promise<void> {
    await supabase().from("activity_logs").insert({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
    });
}

// ─── Projects CRUD ──────────────────────────────────────────────────────────

export async function fetchBuilderProjects(): Promise<DbProject[]> {
    const userId = await currentUserId();
    if (!userId) return [];

    const { data, error } = await supabase()
        .from("projects")
        .select("id, builder_id, name, description, city, possession_status, rera_number, image_url, created_at")
        .eq("builder_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[BuilderDashboard] fetchBuilderProjects error:", error.message);
        return [];
    }
    return (data ?? []) as DbProject[];
}

export interface CreateProjectPayload {
    name: string;
    description?: string;
    city: string;
    possession_status?: string;
    rera_number?: string;
    image_url?: string;
}

export async function createProject(
    payload: CreateProjectPayload
): Promise<{ success: boolean; project?: DbProject; error?: string }> {
    const userId = await currentUserId();
    if (!userId) return { success: false, error: "Not authenticated" };

    const { data, error } = await supabase()
        .from("projects")
        .insert({ ...payload, builder_id: userId })
        .select()
        .single();

    if (error) {
        console.error("[BuilderDashboard] createProject error:", error.message);
        return { success: false, error: error.message };
    }

    await logActivity(userId, "project_created", "project", data.id);
    return { success: true, project: data as DbProject };
}

export interface UpdateProjectPayload {
    name?: string;
    description?: string;
    city?: string;
    possession_status?: string;
    rera_number?: string;
    image_url?: string;
}

export async function updateProject(
    id: string,
    payload: UpdateProjectPayload
): Promise<{ success: boolean; error?: string }> {
    const userId = await currentUserId();
    if (!userId) return { success: false, error: "Not authenticated" };

    const { error } = await supabase()
        .from("projects")
        .update(payload)
        .eq("id", id)
        .eq("builder_id", userId);

    if (error) {
        console.error("[BuilderDashboard] updateProject error:", error.message);
        return { success: false, error: error.message };
    }

    await logActivity(userId, "project_updated", "project", id);
    return { success: true };
}

export async function deleteProject(
    id: string
): Promise<{ success: boolean; error?: string }> {
    const userId = await currentUserId();
    if (!userId) return { success: false, error: "Not authenticated" };

    // Log before delete since the row will be gone
    await logActivity(userId, "project_deleted", "project", id);

    const { error } = await supabase()
        .from("projects")
        .delete()
        .eq("id", id)
        .eq("builder_id", userId);

    if (error) {
        console.error("[BuilderDashboard] deleteProject error:", error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function uploadProjectImage(file: File, projectId: string): Promise<{ success: boolean; url?: string; error?: string }> {
    const userId = await currentUserId();
    if (!userId) return { success: false, error: "Not authenticated" };

    const fileExt = file.name.split(".").pop();
    const fileName = `${projectId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/projects/${fileName}`;

    const { error: uploadError, data: uploadData } = await supabase()
        .storage
        .from("property-media")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (uploadError) {
        console.error("[BuilderDashboard] uploadProjectImage error:", uploadError.message);
        return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase()
        .storage
        .from("property-media")
        .getPublicUrl(uploadData.path);

    return { success: true, url: publicUrl };
}

// ─── Project Units CRUD ─────────────────────────────────────────────────────

export async function fetchProjectUnits(projectId: string): Promise<DbProjectUnit[]> {
    const { data, error } = await supabase()
        .from("project_units")
        .select("id, project_id, unit_number, price, status, area_sqft, bedrooms, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("[BuilderDashboard] fetchProjectUnits error:", error.message);
        return [];
    }
    return (data ?? []) as DbProjectUnit[];
}

export async function fetchAllBuilderUnits(): Promise<(DbProjectUnit & { project_name: string })[]> {
    const userId = await currentUserId();
    if (!userId) return [];

    // Fetch all projects first, then units for each
    const projects = await fetchBuilderProjects();
    if (projects.length === 0) return [];

    const projectIds = projects.map(p => p.id);
    const { data, error } = await supabase()
        .from("project_units")
        .select("id, project_id, unit_number, price, status, area_sqft, bedrooms, created_at")
        .in("project_id", projectIds)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("[BuilderDashboard] fetchAllBuilderUnits error:", error.message);
        return [];
    }

    const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));
    return ((data ?? []) as DbProjectUnit[]).map(unit => ({
        ...unit,
        project_name: projectMap[unit.project_id] ?? "Unknown",
    }));
}

export interface CreateUnitPayload {
    project_id: string;
    unit_number: string;
    price: number;
    area_sqft: number;
    bedrooms?: number;
    status?: UnitStatus;
}

export async function createProjectUnit(
    payload: CreateUnitPayload
): Promise<{ success: boolean; unit?: DbProjectUnit; error?: string }> {
    const { data, error } = await supabase()
        .from("project_units")
        .insert(payload)
        .select()
        .single();

    if (error) {
        console.error("[BuilderDashboard] createProjectUnit error:", error.message);
        return { success: false, error: error.message };
    }
    return { success: true, unit: data as DbProjectUnit };
}

export interface UpdateUnitPayload {
    unit_number?: string;
    price?: number;
    area_sqft?: number;
    bedrooms?: number;
    status?: UnitStatus;
}

export async function updateProjectUnit(
    id: string,
    payload: UpdateUnitPayload
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase()
        .from("project_units")
        .update(payload)
        .eq("id", id);

    if (error) {
        console.error("[BuilderDashboard] updateProjectUnit error:", error.message);
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function deleteProjectUnit(
    id: string
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase()
        .from("project_units")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("[BuilderDashboard] deleteProjectUnit error:", error.message);
        return { success: false, error: error.message };
    }
    return { success: true };
}

// ─── Builder Stats (Aggregated) ─────────────────────────────────────────────

export async function fetchBuilderStats(): Promise<BuilderStats> {
    const userId = await currentUserId();
    if (!userId) return { totalProjects: 0, activeUnits: 0, totalLeads: 0, pipelineValue: 0 };

    // Fetch projects count
    const { count: projectCount } = await supabase()
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("builder_id", userId);

    // Fetch active (available) units across all builder projects
    const projects = await fetchBuilderProjects();
    const projectIds = projects.map(p => p.id);

    let activeUnits = 0;
    let pipelineValue = 0;

    if (projectIds.length > 0) {
        const { data: unitData } = await supabase()
            .from("project_units")
            .select("price, status")
            .in("project_id", projectIds);

        if (unitData) {
            activeUnits = unitData.filter(u => u.status === "available").length;
            pipelineValue = unitData
                .filter(u => u.status === "available")
                .reduce((sum, u) => sum + Number(u.price || 0), 0);
        }
    }

    // Fetch lead count for builder's properties
    const { count: leadCount } = await supabase()
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("agent_id", userId);

    return {
        totalProjects: projectCount ?? 0,
        activeUnits,
        totalLeads: leadCount ?? 0,
        pipelineValue,
    };
}

// ─── Builder Analytics (Aggregate) ──────────────────────────────────────────

export async function fetchBuilderAnalytics(): Promise<BuilderAnalytics> {
    const empty: BuilderAnalytics = { projectViews: 0, totalLeads: 0, sellThroughRate: 0, pipelineValue: 0, monthlyData: [] };
    const userId = await currentUserId();
    if (!userId) return empty;

    // 1. Get all builder project IDs
    const { data: projects } = await supabase()
        .from("projects")
        .select("id")
        .eq("builder_id", userId);

    const projectIds = (projects ?? []).map(p => p.id);
    if (projectIds.length === 0) return empty;

    // 2. Get property IDs linked to those projects
    const { data: properties } = await supabase()
        .from("properties")
        .select("id")
        .in("project_id", projectIds);

    const propertyIds = (properties ?? []).map(p => p.id);

    // 3. Project Views — count property_views for those properties
    let projectViews = 0;
    if (propertyIds.length > 0) {
        const { count } = await supabase()
            .from("property_views")
            .select("id", { count: "exact", head: true })
            .in("property_id", propertyIds);
        projectViews = count ?? 0;
    }

    // 4. Total Leads — count leads for those properties
    let totalLeads = 0;
    if (propertyIds.length > 0) {
        const { count } = await supabase()
            .from("leads")
            .select("id", { count: "exact", head: true })
            .in("property_id", propertyIds);
        totalLeads = count ?? 0;
    }

    // 5. Sell-through rate & Pipeline value from project_units
    const { data: unitData } = await supabase()
        .from("project_units")
        .select("price, status")
        .in("project_id", projectIds);

    const units = unitData ?? [];
    const totalUnits = units.length;
    const soldUnits = units.filter(u => u.status === "sold").length;
    const sellThroughRate = totalUnits > 0 ? Math.round((soldUnits / totalUnits) * 1000) / 10 : 0;
    const pipelineValue = units
        .filter(u => u.status === "available")
        .reduce((sum, u) => sum + Number(u.price || 0), 0);

    // 6. Monthly lead data (last 6 months)
    const monthlyData = await fetchMonthlyLeadData(propertyIds);

    return { projectViews, totalLeads, sellThroughRate, pipelineValue, monthlyData };
}

async function fetchMonthlyLeadData(propertyIds: string[]): Promise<{ month: string; leads: number; conversions: number }[]> {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Initialize last 6 months
    const buckets: Record<string, { leads: number; conversions: number }> = {};
    for (let i = 0; i < 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const key = `${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
        buckets[key] = { leads: 0, conversions: 0 };
    }

    if (propertyIds.length === 0) {
        return Object.entries(buckets).map(([month, v]) => ({ month, ...v }));
    }

    const { data: leads } = await supabase()
        .from("leads")
        .select("created_at, status")
        .in("property_id", propertyIds)
        .gte("created_at", sixMonthsAgo.toISOString());

    for (const lead of leads ?? []) {
        const d = new Date(lead.created_at);
        const key = `${monthNames[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
        if (buckets[key]) {
            buckets[key].leads += 1;
            if (lead.status === "closed" || lead.status === "converted") {
                buckets[key].conversions += 1;
            }
        }
    }

    return Object.entries(buckets).map(([month, v]) => ({ month, ...v }));
}

// ─── Lead Funnel (Status Breakdown) ─────────────────────────────────────────

export async function fetchLeadFunnelData(): Promise<LeadFunnelData> {
    const empty: LeadFunnelData = { new: 0, contacted: 0, visited: 0, closed: 0 };
    const userId = await currentUserId();
    if (!userId) return empty;

    // Get property IDs for this builder's projects
    const { data: projects } = await supabase()
        .from("projects")
        .select("id")
        .eq("builder_id", userId);

    const projectIds = (projects ?? []).map(p => p.id);
    if (projectIds.length === 0) return empty;

    const { data: properties } = await supabase()
        .from("properties")
        .select("id")
        .in("project_id", projectIds);

    const propertyIds = (properties ?? []).map(p => p.id);
    if (propertyIds.length === 0) return empty;

    // Fetch all leads for these properties
    const { data: leads } = await supabase()
        .from("leads")
        .select("status")
        .in("property_id", propertyIds);

    if (!leads) return empty;

    // Client-side grouping by status
    const result: LeadFunnelData = { new: 0, contacted: 0, visited: 0, closed: 0 };
    for (const lead of leads) {
        const s = lead.status as keyof LeadFunnelData;
        if (s in result) result[s]++;
    }
    return result;
}

// ─── Project Leads ──────────────────────────────────────────────────────────

export interface ProjectLead {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    source: string;
    status: string;
    created_at: string;
    property: { id: string; title: string } | null;
    buyer: { id: string; full_name: string | null } | null;
}

export async function fetchProjectLeads(projectId: string): Promise<ProjectLead[]> {
    const userId = await currentUserId();
    if (!userId) return [];

    // Verify the project belongs to this builder and get its properties
    const { data: properties } = await supabase()
        .from("properties")
        .select("id")
        .eq("project_id", projectId)
        .eq("owner_id", userId);

    const propertyIds = (properties ?? []).map(p => p.id);
    if (propertyIds.length === 0) return [];

    // Fetch leads for these properties
    const { data, error } = await supabase()
        .from("leads")
        .select(`
            id, name, phone, email, source, status, created_at,
            property:properties ( id, title ),
            buyer:profiles!leads_buyer_id_fkey ( id, full_name, email )
        `)
        .in("property_id", propertyIds)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[BuilderDashboard] fetchProjectLeads error:", error.message);
        return [];
    }

    // Map buyer email to lead email if missing
    return (data ?? []).map((lead) => {
        const raw = lead as unknown as Record<string, unknown>;
        const property = (Array.isArray(raw.property) ? raw.property[0] : raw.property) as { id: string; title: string } | null;
        const buyer = (Array.isArray(raw.buyer) ? raw.buyer[0] : raw.buyer) as { id: string; full_name: string | null; email: string | null } | null;
        return {
            ...raw,
            property,
            buyer,
            email: (raw.email as string) || buyer?.email || null
        };
    }) as unknown as ProjectLead[];
}

export async function fetchAllBuilderLeads(): Promise<ProjectLead[]> {
    const userId = await currentUserId();
    if (!userId) return [];

    const { data: properties } = await supabase()
        .from("properties")
        .select("id")
        .eq("owner_id", userId);

    const propertyIds = (properties ?? []).map(p => p.id);
    if (propertyIds.length === 0) return [];

    const { data, error } = await supabase()
        .from("leads")
        .select(`
            id, name, phone, email, source, status, created_at,
            property:properties ( id, title ),
            buyer:profiles!leads_buyer_id_fkey ( id, full_name, email )
        `)
        .in("property_id", propertyIds)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[BuilderDashboard] fetchAllBuilderLeads error:", error.message);
        return [];
    }

    return (data ?? []).map((lead) => {
        const raw = lead as unknown as Record<string, unknown>;
        const property = (Array.isArray(raw.property) ? raw.property[0] : raw.property) as { id: string; title: string } | null;
        const buyer = (Array.isArray(raw.buyer) ? raw.buyer[0] : raw.buyer) as { id: string; full_name: string | null; email: string | null } | null;
        return {
            ...raw,
            property,
            buyer,
            email: (raw.email as string) || buyer?.email || null
        };
    }) as unknown as ProjectLead[];
}

export async function fetchBuilderSalesReps(): Promise<{ id: string; name: string }[]> {
    const userId = await currentUserId();
    if (!userId) return [];

    const { data, error } = await supabase()
        .from("profiles")
        .select("id, full_name")
        .eq("role", "agent")
        .limit(20);

    if (error) {
        console.error("[BuilderDashboard] fetchBuilderSalesReps error:", error.message);
        return [];
    }

    return (data ?? []).map((row) => {
        const r = row as { id: string; full_name: string | null };
        return {
            id: r.id,
            name: r.full_name || "Unnamed Representative"
        };
    });
}
