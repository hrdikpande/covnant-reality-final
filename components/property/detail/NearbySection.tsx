import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TrainTrack, School, Hospital, ShoppingBag, Loader2 } from "lucide-react";

interface NearbyPlace {
    label: string;
    icon: React.ElementType;
    name: string;
    distance: string;
    loading: boolean;
}

const TEMPLATES = [
    { label: "Metro / Railway Station", category: "transport", icon: TrainTrack },
    { label: "School / College", category: "education", icon: School },
    { label: "Hospital", category: "health", icon: Hospital },
    { label: "Shopping Mall", category: "shopping", icon: ShoppingBag },
];

interface NearbySectionProps {
    latitude?: number | null;
    longitude?: number | null;
    pincode?: string | null;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

/**
 * Geocode an Indian pincode to lat/lon using Nominatim (OpenStreetMap).
 */
async function geocodePincode(
    pincode: string
): Promise<{ lat: number; lon: number } | null> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(pincode)}&country=India&format=json&limit=1`,
            {
                headers: { "User-Agent": "CovnantReality/1.0" },
                signal: AbortSignal.timeout(8000),
            }
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (!data || data.length === 0) return null;
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (isNaN(lat) || isNaN(lon)) return null;
        return { lat, lon };
    } catch {
        return null;
    }
}

interface OverpassElement {
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: Record<string, string>;
    dist?: number;
}

const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
];

/**
 * Race all Overpass endpoints in parallel — returns the first successful response.
 * This is much faster than trying them sequentially.
 */
async function queryOverpass(query: string, timeoutMs = 15000): Promise<{ elements: OverpassElement[] }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const result = await Promise.any(
            OVERPASS_ENDPOINTS.map(async (endpoint) => {
                const res = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
        );
        return result;
    } finally {
        clearTimeout(timer);
    }
}

/** Build a small focused Overpass query for a single category */
function buildCategoryQuery(category: string, lat: number, lon: number, radius: number): string {
    const filters: Record<string, string> = {
        transport: `nwr["railway"="station"](around:${radius},${lat},${lon});nwr["station"="subway"](around:${radius},${lat},${lon});`,
        education: `nwr["amenity"~"school|college|university"](around:${radius},${lat},${lon});`,
        health:    `nwr["amenity"="hospital"](around:${radius},${lat},${lon});`,
        shopping:  `nwr["shop"~"mall|department_store"](around:${radius},${lat},${lon});`,
    };
    return `[out:json][timeout:10];(${filters[category] || ""});out center;`;
}

/** Cache key for sessionStorage */
function cacheKey(lat: number, lon: number): string {
    return `nearby_${lat.toFixed(4)}_${lon.toFixed(4)}`;
}

export function NearbySection({ latitude, longitude, pincode }: NearbySectionProps) {
    const [fetchedPlaces, setFetchedPlaces] = useState<NearbyPlace[] | null>(null);
    const [resolvedCoords, setResolvedCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [geocoding, setGeocoding] = useState(false);

    const hasDirectCoords = !!latitude && !!longitude;
    const hasPincode = !!pincode && pincode.trim().length > 0;

    // Step 1: If no direct coords but pincode is available, geocode it
    useEffect(() => {
        if (hasDirectCoords || !hasPincode) return;

        let isMounted = true;
        
        const fetchGeocode = async () => {
            await Promise.resolve();
            if (isMounted) setGeocoding(true);
            
            const coords = await geocodePincode(pincode!);
            if (isMounted) {
                setResolvedCoords(coords);
                setGeocoding(false);
            }
        };

        fetchGeocode();
        return () => { isMounted = false; };
    }, [hasDirectCoords, hasPincode, pincode]);

    // Determine the final coordinates to use
    const finalLat = latitude ?? resolvedCoords?.lat ?? null;
    const finalLon = longitude ?? resolvedCoords?.lon ?? null;
    const hasCoords = !!finalLat && !!finalLon;

    const processResult = useCallback(
        (category: string, elements: OverpassElement[], lat: number, lon: number) => {
            const filtered = elements.filter((el) => {
                const t = el.tags || {};
                if (category === "transport") return t.railway === "station" || t.station === "subway";
                if (category === "education") return ["school", "college", "university"].includes(t.amenity || "");
                if (category === "health") return t.amenity === "hospital";
                if (category === "shopping") return t.shop === "mall" || t.shop === "department_store";
                return false;
            });

            if (filtered.length === 0) return null;

            const sorted = filtered
                .map((el) => {
                    const elLat = el.lat || el.center?.lat;
                    const elLon = el.lon || el.center?.lon;
                    if (!elLat || !elLon) return { ...el, dist: Infinity };
                    return { ...el, dist: calculateDistance(lat, lon, elLat, elLon) };
                })
                .sort((a, b) => (a.dist || 0) - (b.dist || 0));

            const nearest = sorted[0];
            if (nearest.dist === Infinity) return null;

            const template = TEMPLATES.find((t) => t.category === category)!;
            const name = nearest.tags?.name || nearest.tags?.brand || template.label.split(" / ")[0];
            const distKm = nearest.dist || 0;
            const distanceLabel = distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`;
            return { name, distance: distanceLabel };
        },
        []
    );

    // Step 2: Fetch nearby places using final coordinates
    useEffect(() => {
        if (!hasCoords || !finalLat || !finalLon) return;

        let isMounted = true;

        const loadNearby = async () => {
            // Check sessionStorage cache first
            const key = cacheKey(finalLat, finalLon);
            try {
                const cached = sessionStorage.getItem(key);
                if (cached) {
                    const parsed = JSON.parse(cached) as NearbyPlace[];
                    if (isMounted) setFetchedPlaces(parsed);
                    return;
                }
            } catch { /* sessionStorage may be unavailable */ }

            const radius = 3000; // 3km — smaller radius = faster queries
            const results: NearbyPlace[] = [];

            // Fetch each category independently and in parallel
            const categoryPromises = TEMPLATES.map(async (template) => {
                try {
                    const query = buildCategoryQuery(template.category, finalLat, finalLon, radius);
                    const data = await queryOverpass(query, 15000);
                    const result = processResult(template.category, data.elements || [], finalLat, finalLon);
                    return {
                        ...template,
                        name: result?.name || "Not found nearby",
                        distance: result?.distance || "N/A",
                        loading: false,
                    };
                } catch {
                    // Individual category failure shouldn't break the whole section
                    return {
                        ...template,
                        name: "Unavailable",
                        distance: "—",
                        loading: false,
                    };
                }
            });

            const settled = await Promise.all(categoryPromises);
            results.push(...settled);

            if (isMounted) {
                setFetchedPlaces(results);
                // Cache the results
                try {
                    sessionStorage.setItem(key, JSON.stringify(results));
                } catch { /* quota exceeded or unavailable — ignore */ }
            }
        };

        loadNearby();
        return () => { isMounted = false; };
    }, [hasCoords, finalLat, finalLon, processResult]);

    const nearbyPlaces = useMemo(() => {
        if (!hasCoords && !geocoding && !hasPincode) {
            return TEMPLATES.map(t => ({ ...t, name: "No location data", distance: "N/A", loading: false }));
        }
        if (fetchedPlaces) return fetchedPlaces;
        return TEMPLATES.map(t => ({ ...t, name: "Nearby", distance: "calculating...", loading: true }));
    }, [hasCoords, geocoding, hasPincode, fetchedPlaces]);

    return (
        <section className="py-6 border-b border-border bg-bg-card">
            <h3 className="text-lg font-bold text-text-primary mb-4">Nearby</h3>

            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-12">
                {nearbyPlaces.map((place, index) => {
                    const Icon = place.icon;
                    return (
                        <div key={index} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-border flex-shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                                    <Icon className="w-5 h-5 text-text-secondary group-hover:text-primary" strokeWidth={1.5} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted leading-none mb-1">{place.label}</span>
                                    {place.loading ? (
                                        <div className="flex items-center gap-1.5 h-4">
                                            <div className="w-20 h-3.5 bg-slate-100 animate-pulse rounded" />
                                        </div>
                                    ) : (
                                        <span className="text-sm font-bold text-text-primary line-clamp-1">{place.name}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                {place.loading ? (
                                    <Loader2 className="w-3 h-3 text-primary animate-spin" />
                                ) : (
                                    <span className="text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 whitespace-nowrap">
                                        {place.distance}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

