import { createClient } from "./server";
import type { User } from "@supabase/supabase-js";

/**
 * Verify that the current request is from an authenticated admin user.
 *
 * 1. Validates the JWT via `getUser()` (server-side, not spoofable)
 * 2. Queries the `profiles` table to confirm role = 'admin'
 *
 * Returns the authenticated user on success, or null + error message on failure.
 */
export async function verifyAdmin(): Promise<{
    user: User | null;
    error: string | null;
}> {
    const supabase = await createClient();

    // 1. Validate JWT — getUser() contacts the Supabase auth server
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { user: null, error: "Not authenticated" };
    }

    // 2. Verify role from the DB (authoritative source of truth)
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
        return { user: null, error: "Failed to verify admin role" };
    }

    if (!profile || profile.role !== "admin") {
        return { user: null, error: "Insufficient permissions" };
    }

    return { user, error: null };
}
