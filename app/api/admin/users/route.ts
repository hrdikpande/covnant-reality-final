import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin-auth";

/**
 * GET /api/admin/users?limit=20&offset=0
 * Fetch paginated user profiles.
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
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, totalCount: count ?? 0 });
}

/**
 * PATCH /api/admin/users
 * Body: { userId: string, isVerified: boolean }
 */
export async function PATCH(request: NextRequest) {
    const { error: authError } = await verifyAdmin();
    if (authError) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await request.json();
    const { userId, isVerified } = body as {
        userId: string;
        isVerified: boolean;
    };

    if (!userId || typeof isVerified !== "boolean") {
        return NextResponse.json(
            { error: "Missing userId or isVerified" },
            { status: 400 }
        );
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from("profiles")
        .update({ is_verified: isVerified })
        .eq("id", userId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
