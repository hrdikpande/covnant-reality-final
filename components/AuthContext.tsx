"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Session, User, AuthError } from "@supabase/supabase-js";

/* ── Types ─────────────────────────────────────────────────── */

export type UserRole =
    | "buyer"
    | "tenant"
    | "owner"
    | "agent"
    | "builder"
    | "admin"
    | null;

/** Map a user role to its dashboard path */
export function getDashboardPath(role: UserRole): string {
    switch (role) {
        case "agent":
            return "/agent";
        case "builder":
            return "/builder";
        case "admin":
            return "/admin";
        case "owner":
            return "/owner";
        case "buyer":
        case "tenant":
        default:
            return "/dashboard";
    }
}

export interface Profile {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    role: UserRole;
    city: string | null;
    avatar_url: string | null;
    is_verified: boolean;
    created_at: string;
}

interface SignUpMetadata {
    full_name: string;
    phone?: string;
    role: string;
    company?: string;
    experience?: string;
}

interface AuthContextType {
    /* State */
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    userRole: UserRole;
    isLoading: boolean;
    authError: string | null;

    /* Actions */
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null; role: UserRole }>;
    signUp: (
        email: string,
        password: string,
        metadata: SignUpMetadata
    ) => Promise<{ error: AuthError | null; role: UserRole }>;

    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
    updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ── Provider ──────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter();


    const supabase = useMemo(() => createClient(), []);

    /* ── Fetch profile from DB ──────────────────────────────── */
    const fetchProfile = useCallback(
        async (userId: string) => {
            console.log("[Auth] fetchProfile: starting query for", userId);

            try {
                // Race the query against a 10s timeout
                const result = await Promise.race([
                    supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", userId)
                        .maybeSingle(),
                    new Promise<{ data: null; error: { message: string } }>((resolve) =>
                        setTimeout(() => resolve({ data: null, error: { message: "Profile fetch timed out after 10s" } }), 10000)
                    ),
                ]);

                const { data, error } = result;

                if (error) {
                    console.error("[Auth] fetchProfile: error -", error.message);
                    setProfile(null);
                    return;
                }

                console.log("[Auth] fetchProfile: success, role =", data?.role);
                setProfile(data as Profile);
            } catch (err) {
                console.error("[Auth] fetchProfile: exception -", err);
                setProfile(null);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    /* ── Session hydration + listener ───────────────────────── */
    useEffect(() => {
        // 1. Get initial session
        const hydrateSession = async () => {
            try {
                const {
                    data: { session: initialSession },
                } = await supabase.auth.getSession();

                setSession(initialSession);
                setUser(initialSession?.user ?? null);

                if (initialSession?.user) {
                    await fetchProfile(initialSession.user.id);
                }
            } catch (err) {
                console.error("Session hydration error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        hydrateSession();

        // 2. Listen for auth state changes (login, logout, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            console.log("[Auth] onAuthStateChange:", event, newSession?.user?.id);
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (event === "SIGNED_IN" && newSession?.user) {
                // Don't await — fire-and-forget so it doesn't block signIn/signUp
                console.log("[Auth] Triggering profile fetch for user:", newSession.user.id);
                fetchProfile(newSession.user.id);
            }

            if (event === "SIGNED_OUT") {
                setProfile(null);
            }

            if (event === "TOKEN_REFRESHED") {
                // Session refreshed automatically — nothing extra needed
            }

            if (event === "PASSWORD_RECOVERY") {
                // User arrived via password reset link
                router.push("/reset-password");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Auth Actions ───────────────────────────────────────── */

    const signIn = async (email: string, password: string) => {
        setAuthError(null);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setAuthError(error.message);
            return { error, role: null as UserRole };
        }

        // Default role from JWT metadata
        let role: UserRole = (data.user?.user_metadata?.role as UserRole) ?? null;

        // Always fetch profile from DB — it is the authoritative source for role.
        // This handles the case where user_metadata was never set or is stale.
        if (data.user) {
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", data.user.id)
                .maybeSingle();
            if (profileData) {
                setProfile(profileData as Profile);
                // Profile role always wins (handles admins promoted via DB only)
                if ((profileData as Profile).role) {
                    role = (profileData as Profile).role;
                }
            }
        }

        console.log("[Auth] signIn: resolved role =", role);
        return { error, role };
    };

    const signUp = async (
        email: string,
        password: string,
        metadata: SignUpMetadata
    ) => {
        setAuthError(null);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: metadata.full_name,
                    phone: metadata.phone || "",
                    role: metadata.role,
                    company: metadata.company || "",
                    experience: metadata.experience || "",
                },
            },
        });
        if (error) {
            setAuthError(error.message);
        }
        const role = (data?.user?.user_metadata?.role as UserRole) ?? null;
        return { error, role };
    };



    const signOut = async () => {
        setAuthError(null);
        await supabase.auth.signOut();
        setProfile(null);
        router.push("/login");
    };

    const resetPassword = async (email: string) => {
        setAuthError(null);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
            setAuthError(error.message);
        }
        return { error };
    };

    const updatePassword = async (password: string) => {
        setAuthError(null);
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setAuthError(error.message);
        }
        return { error };
    };

    const clearError = () => setAuthError(null);

    /* ── Derived state ──────────────────────────────────────── */
    const userRole: UserRole = profile?.role ?? null;

    return (
        <AuthContext.Provider
            value={{
                session,
                user,
                profile,
                userRole,
                isLoading,
                authError,
                signIn,
                signUp,

                signOut,
                resetPassword,
                updatePassword,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/* ── Hook ──────────────────────────────────────────────────── */

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
