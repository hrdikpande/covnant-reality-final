import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin-auth";

/**
 * GET /api/admin/properties/[id]
 * Fetch full property details for admin editing.
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error: authError } = await verifyAdmin();
    if (authError) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("properties")
        .select(`
            id, owner_id, title, description, listing_type, property_type, commercial_type,
            price, area_sqft, area_value, area_unit, bedrooms, bathrooms,
            furnishing, facing, floor, total_floors, possession_status,
            address, locality, city, state, pincode,
            status, is_verified, is_featured,
            rera_number, latitude, longitude,
            contact_number, whatsapp_number,
            amenities, allow_phone, allow_whatsapp, allow_chat,
            landmark, created_at,
            property_media ( id, media_url, media_type )
        `)
        .eq("id", id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: error.code === "PGRST116" ? 404 : 500 });
    }

    return NextResponse.json({ data });
}

/**
 * PATCH /api/admin/properties/[id]
 * Update property fields. Admin privilege — no owner_id check.
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error: authError } = await verifyAdmin();
    if (authError) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
    }

    const body = await request.json();
    const updates = body.updates as Record<string, unknown> | undefined;

    if (!updates || typeof updates !== "object" || Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    // Validate required fields if they're being updated
    if ("title" in updates && (!updates.title || typeof updates.title !== "string" || (updates.title as string).trim().length === 0)) {
        return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
    }
    if ("price" in updates && (typeof updates.price !== "number" || updates.price <= 0)) {
        return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
    }
    if ("address" in updates && (!updates.address || typeof updates.address !== "string" || (updates.address as string).trim().length === 0)) {
        return NextResponse.json({ error: "Address cannot be empty" }, { status: 400 });
    }

    // Prevent updating immutable fields
    const forbidden = ["id", "owner_id", "created_at"];
    for (const key of forbidden) {
        delete (updates as Record<string, unknown>)[key];
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from("properties")
        .update(updates)
        .eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
