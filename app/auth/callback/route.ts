import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type UserRole = "buyer" | "tenant" | "owner" | "agent" | "builder" | "admin";

/** Map a role to its dashboard path. */
function getDashboardPath(role: UserRole | null): string {
    switch (role) {
        case "agent":
            return "/agent";
        case "builder":
            return "/builder";
        case "admin":
            return "/admin";
        case "buyer":
        case "tenant":
        case "owner":
        default:
            return "/dashboard";
    }
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // If a ?next= param was provided, honour it; otherwise compute from role
    const explicitNext = searchParams.get("next");

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
        );

        if (!error) {
            // Use explicit ?next= if provided, otherwise redirect to role dashboard
            const redirectPath =
                explicitNext ??
                getDashboardPath(
                    (data.session?.user?.user_metadata?.role as UserRole) ??
                    null
                );
            return NextResponse.redirect(`${origin}${redirectPath}`);
        }
    }

    // Return the user to login on error
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
