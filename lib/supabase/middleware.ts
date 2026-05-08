import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Creates a Supabase client scoped to the middleware request/response
 * and validates + refreshes the user session.
 *
 * Returns the authenticated user (if any) and the response with
 * updated cookies so the browser stays in sync.
 *
 * If Supabase environment variables are missing or the connection fails,
 * this function falls through gracefully — returning null user and a
 * pass-through response so the site remains accessible.
 */
export async function updateSession(request: NextRequest) {
    // Start with a "pass-through" response
    let supabaseResponse = NextResponse.next({ request });

    // Guard: if Supabase env vars are missing, fall through gracefully
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn(
            "[middleware] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. " +
            "Skipping session validation — all requests will be treated as unauthenticated."
        );
        return { user: null, supabaseResponse };
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        // 1. Set on the request so downstream SSR can read them
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );

                        // 2. Recreate the response to pick up the mutated request
                        supabaseResponse = NextResponse.next({ request });

                        // 3. Set on the response so the browser gets them
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // IMPORTANT: Use getUser() — it validates the JWT against the auth server.
        // Do NOT use getSession() which only reads from local cookies and can be
        // spoofed.
        const {
            data: { user },
        } = await supabase.auth.getUser();

        return { user, supabaseResponse };
    } catch (error) {
        console.error("[middleware] Supabase session validation failed:", error);
        // Fall through gracefully — treat as unauthenticated
        return { user: null, supabaseResponse };
    }
}
