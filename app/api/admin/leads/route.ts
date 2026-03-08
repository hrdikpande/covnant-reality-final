import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin-auth";

/**
 * GET /api/admin/leads?limit=20&offset=0
 * Fetch paginated leads with property + agent info.
 */
export async function GET(request: NextRequest) {
    const { error: authError } = await verifyAdmin();
    if (authError) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
    const offset = Number(searchParams.get("offset") ?? "0");

    const supabase = await createClient();
    const { data, error, count } = await supabase
        .from("leads")
        .select(
            `
            *,
            properties!leads_property_id_fkey ( title, city ),
            profiles!leads_agent_id_fkey ( full_name )
        `,
            { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = (data ?? []).map((row: Record<string, unknown>) => {
        const property = row.properties as Record<string, unknown> | null;
        const agent = row.profiles as Record<string, unknown> | null;

        return {
            id: row.id as string,
            property_id: row.property_id as string | null,
            buyer_id: row.buyer_id as string | null,
            agent_id: row.agent_id as string | null,
            name: row.name as string | null,
            phone: row.phone as string | null,
            source: row.source as string,
            status: row.status as string,
            created_at: row.created_at as string,
            property_title: (property?.title as string) ?? null,
            property_city: (property?.city as string) ?? null,
            agent_name: (agent?.full_name as string) ?? null,
        };
    });

    return NextResponse.json({ data: mapped, totalCount: count ?? 0 });
}
