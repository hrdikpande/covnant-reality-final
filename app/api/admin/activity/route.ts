import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin-auth";

export async function GET(request: NextRequest) {
    const { error: authError } = await verifyAdmin();
    if (authError) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? "10"), 50);

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("activity_logs")
        .select(`
            *,
            profiles!activity_logs_user_id_fkey ( full_name )
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = (data ?? []).map((row: Record<string, unknown>) => {
        const profile = row.profiles as Record<string, unknown> | null;
        return {
            id: row.id as string,
            user_id: row.user_id as string | null,
            action: row.action as string,
            entity_type: row.entity_type as string,
            entity_id: row.entity_id as string | null,
            created_at: row.created_at as string,
            user_name: (profile?.full_name as string) ?? null,
        };
    });

    return NextResponse.json({ data: mapped });
}
