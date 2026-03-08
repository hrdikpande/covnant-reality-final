import { createClient } from "@/lib/supabase/client";

/**
 * Insert a row into `property_views`.
 * Fire-and-forget — never throws so it can't break the page.
 */
export async function recordPropertyView(
    propertyId: string,
    userId?: string | null
): Promise<{ success: boolean }> {
    // Guard: never send a null/empty propertyId – would violate NOT NULL constraint
    if (!propertyId) return { success: false };

    try {
        const supabase = createClient();
        const { error } = await supabase.from("property_views").insert({
            property_id: propertyId,
            user_id: userId ?? null,
        });

        if (error) {
            console.error("[PropertyViews] insert error:", error.message);
            return { success: false };
        }
        return { success: true };
    } catch (err) {
        console.error("[PropertyViews] unexpected error:", err);
        return { success: false };
    }
}
