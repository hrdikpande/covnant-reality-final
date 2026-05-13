import { createClient } from "@/lib/supabase/client";
import { extractLocationRoot } from "@/lib/locationUtils";
import type { SearchProperty, SearchFilters } from "@/types";

export interface SearchResponse {
    data: SearchProperty[];
    total: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getPublicUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    const supabase = createClient();
    const { data } = supabase.storage.from("property-media").getPublicUrl(path);
    return data.publicUrl;
}

// ─── Batch-fetch first image for a list of property IDs ─────────────────────

async function fetchPropertyImages(
    propertyIds: string[]
): Promise<Record<string, string>> {
    if (propertyIds.length === 0) return {};
    const supabase = createClient();
    const { data } = await supabase
        .from("property_media")
        .select("property_id, media_url")
        .in("property_id", propertyIds)
        .eq("media_type", "image")
        .order("created_at", { ascending: true });

    const map: Record<string, string> = {};
    for (const row of data ?? []) {
        // Keep only the first image per property
        if (!map[row.property_id]) {
            map[row.property_id] = getPublicUrl(row.media_url);
        }
    }
    return map;
}

// ─── Slugify helper (must match HeroSearch slugify) ─────────────────────────

function slugify(s: string): string {
    return s.toLowerCase().replace(/[/&,\s]+/g, "-");
}

// ─── Single RPC call helper ─────────────────────────────────────────────────

async function runRpcSearch(
    filters: SearchFilters,
    locationRoot: string | null,
    limit: number,
    offset: number,
    subtypeOverride?: string | null
): Promise<SearchProperty[]> {
    const supabase = createClient();

    // If an explicit override is provided, use it; otherwise derive from filters
    const subtype =
        subtypeOverride !== undefined
            ? subtypeOverride
            : (filters.subtypes ?? []).length === 1
              ? filters.subtypes![0]
              : null;

    const { data, error } = await supabase.rpc("search_properties", {
        p_city: locationRoot,
        p_city_id: null,
        p_state_id: null,
        p_locality_id: null,
        p_bedrooms: filters.bedrooms ?? null,
        p_listing_type: filters.listing_type ?? null,
        p_property_type: filters.property_type ?? null,
        p_subtype: subtype,
        p_is_verified: filters.is_verified ?? null,
        p_agent_id: filters.agentId ?? null,
        p_min_price: filters.price_min ?? null,
        p_max_price: filters.price_max ?? null,
        p_min_area: filters.area_min ?? null,
        p_max_area: filters.area_max ?? null,
        p_furnishing: filters.furnishing ?? null,
        p_limit: limit,
        p_offset: offset,
    });

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []) as SearchProperty[];
}

// ─── Main Search Function ───────────────────────────────────────────────────

export async function searchProperties(
    filters: SearchFilters,
    limit: number = 12,
    offset: number = 0
): Promise<SearchResponse> {
    const locationRoot = filters.city
        ? extractLocationRoot(filters.city)
        : null;

    const subtypes = filters.subtypes ?? [];
    const hasMultipleSubtypes = subtypes.length > 1;

    // ── Primary search ─────────────────────────────────────────────────
    // When multiple subtypes are selected, run one RPC per subtype in
    // parallel (each using the DB's ILIKE matching) and merge/dedupe.
    // This gives correct OR-logic for subtype filters.
    let rows: SearchProperty[];
    let total: number;

    if (hasMultipleSubtypes) {
        // Fire one query per subtype, all in parallel
        const subtypePromises = subtypes.map((st) =>
            runRpcSearch(filters, locationRoot, 50, 0, st)
        );
        const subtypeResults = await Promise.all(subtypePromises);

        // Merge and deduplicate by property id
        const seenIds = new Set<string>();
        const merged: SearchProperty[] = [];
        for (const batch of subtypeResults) {
            for (const row of batch) {
                if (!seenIds.has(row.id)) {
                    seenIds.add(row.id);
                    merged.push(row);
                }
            }
        }
        rows = merged;
        total = rows.length;
    } else {
        // Single or no subtype — normal single RPC call
        rows = await runRpcSearch(filters, locationRoot, limit, offset);
        total =
            rows.length > 0
                ? Number(
                    (rows[0] as SearchProperty & { total_count?: number })
                        .total_count ?? 0
                )
                : 0;
    }

    // ── Extra locations (parallel queries, deduped) ────────────────────
    const extraLocs = filters.extra_locations ?? [];
    if (extraLocs.length > 0) {
        const seenIds = new Set(rows.map((r) => r.id));

        // For extra locations, also respect multi-subtype logic
        if (hasMultipleSubtypes) {
            const extraPromises = extraLocs.flatMap((loc) =>
                subtypes.map((st) =>
                    runRpcSearch(filters, extractLocationRoot(loc), 50, 0, st)
                )
            );
            const extraResults = await Promise.all(extraPromises);
            for (const batch of extraResults) {
                for (const row of batch) {
                    if (!seenIds.has(row.id)) {
                        seenIds.add(row.id);
                        rows.push(row);
                    }
                }
            }
        } else {
            const extraPromises = extraLocs.map((loc) =>
                runRpcSearch(filters, extractLocationRoot(loc), 50, 0)
            );
            const extraResults = await Promise.all(extraPromises);
            for (const batch of extraResults) {
                for (const row of batch) {
                    if (!seenIds.has(row.id)) {
                        seenIds.add(row.id);
                        rows.push(row);
                    }
                }
            }
        }
        // Recalculate total after merging
        total = rows.length;
    }

    // ── Client-side possession filter (not in RPC) ────────────────────
    if (filters.possession) {
        const posVal = filters.possession.toLowerCase();
        rows = rows.filter((r) => {
            const raw = r as SearchProperty & {
                possession_status?: string | null;
            };
            if (!raw.possession_status) return false;
            return raw.possession_status.toLowerCase().includes(posVal);
        });
        total = rows.length;
    }

    // ── Client-side sorting ───────────────────────────────────────────
    if (filters.sort_by === "price_low") {
        rows.sort((a, b) => a.price - b.price);
    } else if (filters.sort_by === "price_high") {
        rows.sort((a, b) => b.price - a.price);
    }
    // "newest" is the default sort from the RPC (created_at DESC)

    // ── Apply pagination (needed after client-side merging/filtering) ──
    if (hasMultipleSubtypes || extraLocs.length > 0 || filters.possession) {
        rows = rows.slice(offset, offset + limit);
    }

    // ── Batch-fetch images ────────────────────────────────────────────
    const ids = rows.map((r) => r.id);
    const imageMap = await fetchPropertyImages(ids);

    const enrichedRows = rows.map((r) => ({
        ...r,
        image_url: imageMap[r.id] ?? null,
    }));

    return {
        data: enrichedRows,
        total,
    };
}

// ─── Fetch Similar Locations ────────────────────────────────────────────────
// Returns distinct city values where properties matching the current filters
// exist (excluding the current city).

export async function fetchSimilarLocations(
    filters: SearchFilters
): Promise<string[]> {
    const supabase = createClient();

    let query = supabase
        .from("properties")
        .select("city")
        .eq("status", "approved")
        .not("city", "is", null);

    // Apply same broad filters
    if (filters.listing_type) {
        query = query.eq("listing_type", filters.listing_type);
    }
    if (filters.property_type) {
        query = query.eq("property_type", filters.property_type);
    }

    const { data } = await query.limit(500);

    // Deduplicate and exclude current city
    const currentCity = (filters.city || "").toLowerCase();
    const citySet = new Map<string, string>(); // lowercase → original
    for (const row of data ?? []) {
        if (!row.city) continue;
        const lower = row.city.toLowerCase().trim();
        if (lower === currentCity) continue;
        if (!citySet.has(lower)) {
            citySet.set(
                lower,
                row.city.charAt(0).toUpperCase() +
                    row.city.slice(1).toLowerCase()
            );
        }
    }

    return Array.from(citySet.values()).sort();
}
