import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin-auth";

/**
 * GET /api/admin/properties?limit=20&offset=0
 * Fetch paginated properties with owner info.
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
        .from("properties")
        .select(
            `
            *,
            profiles!properties_owner_id_fkey ( full_name, role )
        `,
            { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = (data ?? []).map((row: Record<string, unknown>) => {
        const profile = row.profiles as Record<string, unknown> | null;
        return {
            id: row.id as string,
            owner_id: row.owner_id as string,
            title: row.title as string,
            description: row.description as string | null,
            listing_type: row.listing_type as string,
            property_type: row.property_type as string,
            price: row.price as number,
            area_sqft: row.area_sqft as number,
            bedrooms: row.bedrooms as number | null,
            bathrooms: row.bathrooms as number | null,
            furnishing: row.furnishing as string | null,
            address: row.address as string,
            locality: row.locality as string | null,
            city: row.city as string,
            state: row.state as string | null,
            status: row.status as string,
            is_verified: row.is_verified as boolean,
            is_featured: row.is_featured as boolean,
            rera_number: row.rera_number as string | null,
            created_at: row.created_at as string,
            owner_name: (profile?.full_name as string) ?? null,
            owner_role: (profile?.role as string) ?? null,
        };
    });

    return NextResponse.json({ data: mapped, totalCount: count ?? 0 });
}

/**
 * POST /api/admin/properties
 * Body: { action: "approve" | "reject", propertyId: string }
 */
export async function POST(request: NextRequest) {
    const { error: authError } = await verifyAdmin();
    if (authError) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await request.json();
    const { action, propertyId } = body as {
        action: string;
        propertyId: string;
    };

    if (!action || !propertyId) {
        return NextResponse.json(
            { error: "Missing action or propertyId" },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    if (action === "approve") {
        const { data, error } = await supabase.rpc("approve_property", {
            p_property_id: propertyId,
        });
        if (error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        const result = data as { success: boolean; error?: string };
        if (!result.success)
            return NextResponse.json(
                { error: result.error ?? "Unknown error" },
                { status: 500 }
            );
        return NextResponse.json({ success: true });
    }

    if (action === "reject") {
        const { data, error } = await supabase.rpc("reject_property", {
            p_property_id: propertyId,
        });
        if (error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        const result = data as { success: boolean; error?: string };
        if (!result.success)
            return NextResponse.json(
                { error: result.error ?? "Unknown error" },
                { status: 500 }
            );
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

/**
 * DELETE /api/admin/properties
 * Body: { propertyId: string }
 */
export async function DELETE(request: NextRequest) {
    const { error: authError } = await verifyAdmin();
    if (authError) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { propertyId } = await request.json();
    if (!propertyId) {
        return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch media for storage deletion
    const { data: mediaRows } = await supabase
        .from("property_media")
        .select("media_url")
        .eq("property_id", propertyId);

    if (mediaRows && mediaRows.length > 0) {
        const paths = (mediaRows as Record<string, string>[])
            .map((m) => m.media_url)
            .filter((p: string) => p && !p.startsWith("http") && !p.startsWith("/"));
        
        if (paths.length > 0) {
            await supabase.storage.from("property-media").remove(paths);
        }
    }

    // 2. Delete the property (cascades to DB media, etc.)
    const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
