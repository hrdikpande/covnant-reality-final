import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/admin-auth";

export async function GET() {
    const { error: authError } = await verifyAdmin();
    if (authError) {
        return NextResponse.json({ error: authError }, { status: 401 });
    }

    const supabase = await createClient();

    // Run all counts in parallel
    const [usersRes, propsRes, leadsRes, pendingRes, cityRes] =
        await Promise.all([
            supabase.from("profiles").select("id", { count: "exact", head: true }),
            supabase.from("properties").select("id", { count: "exact", head: true }),
            supabase.from("leads").select("id", { count: "exact", head: true }),
            supabase
                .from("properties")
                .select("id", { count: "exact", head: true })
                .eq("status", "pending"),
            supabase.from("properties").select("city"),
        ]);

    const firstError = [usersRes, propsRes, leadsRes, pendingRes, cityRes].find(
        (r) => r.error
    );
    if (firstError?.error) {
        return NextResponse.json(
            { error: firstError.error.message },
            { status: 500 }
        );
    }

    // Aggregate properties by city
    const cityMap = new Map<string, number>();
    const cityData = (cityRes.data ?? []) as { city: string }[];
    for (const row of cityData) {
        if (row.city) {
            cityMap.set(row.city, (cityMap.get(row.city) ?? 0) + 1);
        }
    }
    const propertiesByCity = Array.from(cityMap.entries())
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

    return NextResponse.json({
        data: {
            totalUsers: usersRes.count ?? 0,
            totalProperties: propsRes.count ?? 0,
            totalLeads: leadsRes.count ?? 0,
            pendingApprovals: pendingRes.count ?? 0,
            propertiesByCity,
        },
    });
}
