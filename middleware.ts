import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

/* ── Role → Route mappings ────────────────────────────────────── */

type UserRole = "buyer" | "tenant" | "owner" | "agent" | "builder" | "admin";

/**
 * Routes that require authentication + specific roles.
 * Each key is a route‐prefix; value is the set of roles allowed.
 */
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
    "/dashboard": ["buyer", "tenant"],
    "/agent": ["agent"],
    "/builder": ["builder"],
    "/admin": ["admin"],
    "/owner": ["owner"],
    "/property": ["buyer", "tenant", "owner", "agent", "builder", "admin"],
};

/** Routes that authenticated users should NOT visit (redirect to their dashboard). */
const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];



/* ── Middleware ─────────────────────────────────────────────────── */

export async function middleware(request: NextRequest) {
    try {
        const { user, supabaseResponse } = await updateSession(request);
        let { pathname } = request.nextUrl;

        // 0a. Normalize plural /properties/ to singular /property/
        if (pathname.startsWith("/properties/")) {
            const normalizedUrl = request.nextUrl.clone();
            normalizedUrl.pathname = pathname.replace("/properties/", "/property/");
            return NextResponse.redirect(normalizedUrl, 301);
        }

        const role = (user?.user_metadata?.role as UserRole) ?? null;

        /* ─── 0. Property UUID → Slug redirect ───────────────────────── */
        const uuidPropertyMatch = pathname.match(/^\/property\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
        if (uuidPropertyMatch) {
            const propertyUuid = uuidPropertyMatch[1];
            try {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
                if (supabaseUrl && supabaseAnonKey) {
                    const supabaseClient = createServerClient(supabaseUrl, supabaseAnonKey, {
                        cookies: {
                            getAll() { return request.cookies.getAll(); },
                            setAll() { /* no-op */ },
                        },
                    });
                    const { data } = await supabaseClient
                        .from("properties")
                        .select("slug")
                        .eq("id", propertyUuid)
                        .maybeSingle();

                    if (data?.slug) {
                        const slugUrl = request.nextUrl.clone();
                        slugUrl.pathname = `/property/${data.slug}`;
                        return NextResponse.redirect(slugUrl, 301);
                    }
                }
            } catch {
                // Fall through — let the page handle it
            }
        }

        /* ─── 1. Authenticated user visiting an auth page → redirect to home ── */
        if (user && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
            const dashboardUrl = request.nextUrl.clone();
            dashboardUrl.pathname = '/';
            return NextResponse.redirect(dashboardUrl);
        }

        /* ─── 2. Check protected routes ─────────────────────────────── */
        for (const [prefix, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
            if (!pathname.startsWith(prefix)) continue;

            // 2a. Not authenticated → redirect to /login with ?next= param
            if (!user) {
                const loginUrl = request.nextUrl.clone();
                loginUrl.pathname = "/login";
                loginUrl.searchParams.set("redirect", pathname);
                return NextResponse.redirect(loginUrl);
            }

            // 2b. Authenticated but role doesn't match → redirect to /
            if (!role || !allowedRoles.includes(role)) {
                const homeUrl = request.nextUrl.clone();
                homeUrl.pathname = "/";
                return NextResponse.redirect(homeUrl);
            }

            // 2c. For /admin routes, do a secondary DB check to confirm the role
            //     is actually 'admin' in the profiles table (guards against stale JWTs)
            if (prefix === "/admin") {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

                if (!supabaseUrl || !supabaseAnonKey) {
                    // Can't verify admin role without Supabase — deny access
                    const homeUrl = request.nextUrl.clone();
                    homeUrl.pathname = "/";
                    return NextResponse.redirect(homeUrl);
                }

                const supabaseAdmin = createServerClient(
                    supabaseUrl,
                    supabaseAnonKey,
                    {
                        cookies: {
                            getAll() {
                                return request.cookies.getAll();
                            },
                            setAll() {
                                // no-op in middleware verification — cookies are
                                // already refreshed by updateSession above
                            },
                        },
                    }
                );

                const { data: profile } = await supabaseAdmin
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .maybeSingle();

                if (!profile || profile.role !== "admin") {
                    const homeUrl = request.nextUrl.clone();
                    homeUrl.pathname = "/";
                    return NextResponse.redirect(homeUrl);
                }
            }

            // 2d. Role matches → allow through (with refreshed cookies)
            break;
        }

        /* ─── 3. All other routes: pass through with refreshed session ── */
        return supabaseResponse;
    } catch (error) {
        console.error("[middleware] Unexpected error — falling through:", error);
        // Fall through gracefully so the site remains accessible
        return NextResponse.next();
    }
}

/* ── Matcher ───────────────────────────────────────────────────── */

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static (static files)
         * - _next/image (image optimisation)
         * - favicon.ico, sitemap.xml, robots.txt
         * - /api routes (handled separately)
         * - /auth/callback (OAuth callback — must not be intercepted)
         * - Static assets with common extensions
         */
        "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|api/|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};

