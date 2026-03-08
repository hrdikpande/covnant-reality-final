"use client";

import { useLocation } from "@/components/LocationContext";

/**
 * @deprecated Use `useLocation` from `@/components/LocationContext` instead.
 * This is kept for backward compatibility with components expecting `useCity()`.
 */
export function useCity() {
    const context = useLocation();
    return context;
}
