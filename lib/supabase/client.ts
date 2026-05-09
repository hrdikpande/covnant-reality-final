import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
    if (browserClient) return browserClient;

    browserClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                flowType: "pkce",
                persistSession: true,
                detectSessionInUrl: true,
                // Bypass Navigator LockManager to prevent
                // "Acquiring an exclusive Navigator LockManager lock" timeout errors.
                // The lock is used for multi-tab session coordination but causes
                // cascading failures when the lock queue backs up.
                lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
                    return await fn();
                },
            },
        }
    );
    return browserClient;
}
