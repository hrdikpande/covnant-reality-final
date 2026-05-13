import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin-auth";

export async function GET(request: NextRequest) {
    const { error: authError } = await verifyAdmin();
    if (authError) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const serialsParam = searchParams.get("serials");

    if (!serialsParam) {
        return NextResponse.json({ data: [] });
    }

    const serials = serialsParam
        .split(",")
        .map(s => parseInt(s.trim(), 10))
        .filter(s => !isNaN(s));

    if (serials.length === 0) {
        return NextResponse.json({ data: [] });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("properties")
        .select("*")
        .in("serial_number", serials)
        .eq("status", "approved");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
}
