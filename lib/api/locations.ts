import { createClient } from "@/lib/supabase/client";
import { isCorruptedLocation } from "@/lib/locationUtils";

export interface State {
    id: string;
    name: string;
    country: string;
    active: boolean;
}

export interface City {
    id: string;
    state_id: string;
    name: string;
}

export interface Locality {
    id: string;
    city_id: string;
    name: string;
    pincode: string;
    latitude: number | null;
    longitude: number | null;
}

// Memory cache for location data to avoid redundant DB queries
const cache = {
    states: null as State[] | null,
    citiesByState: {} as Record<string, City[]>,
    localitiesByCity: {} as Record<string, Locality[]>
};

export function clearLocationsCache(type: 'cities' | 'localities', parentId: string) {
    if (type === 'cities') {
        delete cache.citiesByState[parentId];
    } else if (type === 'localities') {
        delete cache.localitiesByCity[parentId];
    }
}

/**
 * Fetch all active states
 */
export async function getStates(): Promise<State[]> {
    if (cache.states) return cache.states;

    const supabase = createClient();
    const { data, error } = await supabase
        .from("states")
        .select("*")
        .eq("active", true)
        .order("name");

    if (error) {
        console.error("Error fetching states:", error);
        return [];
    }

    cache.states = data || [];
    return cache.states;
}

/**
 * Fetch cities by state ID
 */
export async function getCitiesByState(stateId: string): Promise<City[]> {
    if (cache.citiesByState[stateId]) return cache.citiesByState[stateId];

    const supabase = createClient();
    const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("state_id", stateId)
        .order("name");

    if (error) {
        console.error("Error fetching cities:", error);
        return [];
    }

    cache.citiesByState[stateId] = data || [];
    return cache.citiesByState[stateId];
}

/**
 * Fetch localities by city ID
 */
export async function getLocalitiesByCity(cityId: string): Promise<Locality[]> {
    if (cache.localitiesByCity[cityId]) return cache.localitiesByCity[cityId];

    const supabase = createClient();
    const { data, error } = await supabase
        .from("localities")
        .select("*")
        .eq("city_id", cityId)
        .order("name");

    if (error) {
        console.error("Error fetching localities:", error);
        return [];
    }

    cache.localitiesByCity[cityId] = data || [];
    return cache.localitiesByCity[cityId];
}

export interface SearchLocationResult {
    id: string;
    name: string;
    type: 'city' | 'locality';
    pincode?: string;
    parentName?: string;
    stateName?: string;
}

/**
 * Search locations for autocomplete
 */
export async function searchLocations(query: string): Promise<SearchLocationResult[]> {
    if (!query || query.trim().length < 2) return [];
    const cleanQuery = query.trim();
    const supabase = createClient();

    const [citiesRes, localitiesRes] = await Promise.all([
        supabase
            .from("cities")
            .select("id, name, states(name)")
            .ilike("name", `%${cleanQuery}%`)
            .limit(5),
        supabase
            .from("localities")
            .select("id, name, pincode, cities(name, states(name))")
            .or(`name.ilike.%${cleanQuery}%,pincode.eq.${cleanQuery}`)
            .limit(5)
    ]);

    const results: SearchLocationResult[] = [];

    if (citiesRes.data) {
        for (const c of citiesRes.data) {
            const stateData = c.states;
            const actualStateName = Array.isArray(stateData)
                ? stateData[0]?.name
                : (stateData as { name: string } | null)?.name;
            results.push({
                id: c.id,
                name: c.name,
                type: 'city',
                stateName: actualStateName
            });
        }
    }

    if (localitiesRes.data) {
        for (const l of localitiesRes.data) {
            const cityData = l.cities;
            const actualCity = Array.isArray(cityData) ? cityData[0] : cityData;
            // Using unknown cast to bypass lint check for Supabase join results
            const actualCityObj = actualCity as unknown as { name?: string; states?: { name: string } | { name: string }[] };
            const stateData = actualCityObj?.states;
            const actualState = Array.isArray(stateData) ? stateData[0] : stateData;
            results.push({
                id: l.id,
                name: l.name,
                type: 'locality',
                pincode: l.pincode,
                parentName: actualCityObj?.name,
                stateName: (actualState as { name?: string } | undefined)?.name
            });
        }
    }

    return results;
}

// ─── Property Location Suggestions (ordered by count) ───────────────────────

export interface PropertyLocationSuggestion {
    location: string;       // the raw location string from DB
    property_count: number; // how many approved properties have this location
}

// In-memory cache for property locations
let propertyLocationsCache: PropertyLocationSuggestion[] | null = null;
let propertyLocationsCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch distinct locality values from the properties table, ordered by count descending.
 * Returns ALL variants (Medchal, Medchal Road, etc.) with their property counts.
 * Locations with more properties appear first in the dropdown.
 */
export async function getPropertyLocations(): Promise<PropertyLocationSuggestion[]> {
    // Return cached data if fresh
    if (propertyLocationsCache && (Date.now() - propertyLocationsCacheTime) < CACHE_TTL_MS) {
        return propertyLocationsCache;
    }

    const supabase = createClient();
    const { data, error } = await supabase
        .from("properties")
        .select("locality")
        .eq("status", "approved")
        .not("locality", "is", null);

    if (error) {
        console.error("[Locations] getPropertyLocations error:", error.message);
        return propertyLocationsCache || [];
    }

    if (!data) return [];

    // Group by locality and count occurrences
    const countMap: Record<string, number> = {};
    for (const row of data) {
        const loc = (row.locality as string)?.trim();
        if (!loc || isCorruptedLocation(loc)) continue;
        countMap[loc] = (countMap[loc] || 0) + 1;
    }

    // Convert to array and sort by count descending
    const results = Object.entries(countMap)
        .map(([location, property_count]) => ({ location, property_count }))
        .sort((a, b) => b.property_count - a.property_count);

    // Cache the results
    propertyLocationsCache = results;
    propertyLocationsCacheTime = Date.now();

    return results;
}
