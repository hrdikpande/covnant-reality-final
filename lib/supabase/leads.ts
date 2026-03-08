import { createClient } from "@/lib/supabase/client";

// ─── Types ──────────────────────────────────────────────────────────────────

/** Maps to the DB `lead_source` enum: 'call' | 'whatsapp' | 'chat' | 'visit' */
export type LeadSource = "call" | "whatsapp" | "chat" | "visit";

/** UI-facing action labels used in LeadModal / PropertyCard */
export type LeadActionType = "Call" | "WhatsApp" | "Chat" | "Book Visit";

export interface CreateLeadParams {
    propertyId: string;
    name: string;
    phone: string;
    source: LeadActionType;
}

export interface CreateLeadResult {
    success: boolean;
    lead_id?: string;
    error?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function supabase() {
    return createClient();
}

/** Convert UI action string to DB `lead_source` enum value */
function toLeadSource(action: LeadActionType): LeadSource {
    const map: Record<LeadActionType, LeadSource> = {
        Call: "call",
        WhatsApp: "whatsapp",
        Chat: "chat",
        "Book Visit": "visit",
    };
    return map[action];
}

// ─── Create Lead ────────────────────────────────────────────────────────────

export async function createLead(params: CreateLeadParams): Promise<CreateLeadResult> {
    const { data, error } = await supabase().rpc("create_lead", {
        p_property_id: params.propertyId,
        p_name: params.name,
        p_phone: params.phone,
        p_source: toLeadSource(params.source),
    });

    if (error) {
        console.error("[Leads] createLead RPC error:", error.message);
        return { success: false, error: error.message };
    }

    const result = data as { success: boolean; lead_id?: string; error?: string };
    return result;
}
