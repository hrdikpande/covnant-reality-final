import { createClient } from "./client";
import type { PropertyReview } from "@/types";

// Helper function to get a user's display name from their auth profile
async function getUserName(userId: string): Promise<string> {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
            .from('profiles') // Assuming a profiles table might exist
            .select('full_name, name')
            .eq('id', userId)
            .single();

        if (!error && data) {
            return data.full_name || data.name || "Anonymous";
        }
    } catch {
        // fail silently
    }

    return "User"; // Fallback
}

export async function fetchPropertyReviews(propertyId: string): Promise<PropertyReview[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("property_reviews")
        .select("*")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }

    // We'll map through and attempt to attach a name
    return Promise.all((data || []).map(async (review) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const name = await getUserName((review as any).user_id);
        return {
            ...review,
            user_name: name
        } as PropertyReview;
    }));
}

export async function submitPropertyReview(
    propertyId: string,
    userId: string,
    rating: number,
    comment: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    const { error } = await supabase
        .from("property_reviews")
        .insert({
            property_id: propertyId,
            user_id: userId,
            rating,
            comment: comment.trim() || null,
        });

    if (error) {
        console.error("Error submitting review:", error);
        // Supabase error for unique constraint violation is often 23505
        if (error.code === '23505') {
            return { success: false, error: "You have already reviewed this property." };
        }
        return { success: false, error: "Failed to submit review. Please try again later." };
    }

    return { success: true };
}
