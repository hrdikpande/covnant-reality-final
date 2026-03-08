import { createClient } from "@/lib/supabase/client";
import type { SearchFilters } from "@/types";

export interface SavedSearchRow {
    id: string;
    user_id: string;
    filters: SearchFilters;
    label: string | null;
    created_at: string;
}

export async function saveSearch(
    filters: SearchFilters,
    label: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase.from("saved_searches").insert({
        user_id: user.id,
        filters,
        label,
    });

    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true };
}

export async function getSavedSearches(): Promise<SavedSearchRow[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("saved_searches")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function deleteSavedSearch(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from("saved_searches")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}
