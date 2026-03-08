import { createClient } from "@/lib/supabase/client";

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
