"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PropertyCard } from "./PropertyCard";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { fetchRecommendedProperties } from "@/lib/supabase/homepage";
import { useCity } from "@/components/CityContext";
import { HomepageEmptyState } from "./HomepageEmptyState";
import { Sparkles } from "lucide-react";
import type { Property } from "@/types";

export function RecommendedForYou() {
    const { selectedCity } = useCity();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [prevCity, setPrevCity] = useState(selectedCity);

    if (selectedCity !== prevCity) {
        setPrevCity(selectedCity);
        setLoading(true);
    }

    useEffect(() => {
        let cancelled = false;
        // setLoading(true); // Handled during rendering
        fetchRecommendedProperties(6, selectedCity || undefined)
            .then((data) => {
                if (!cancelled) setProperties(data);
            })
            .catch((err) => console.error("[Recommended] fetch error:", err))
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [selectedCity]);

    return (
        <section className="py-12 lg:py-20 bg-white">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">
                            Recommended For You
                        </h2>
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-wide">
                            <Sparkles className="h-3 w-3" />
                            Recommended
                        </span>
                    </div>
                    <p className="text-sm md:text-base text-slate-500 mt-1">
                        Based on your recent searches{selectedCity ? ` in ${selectedCity}` : ""}
                    </p>
                </div>
                <Link
                    href="/search"
                    className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                    aria-label="View all recommended properties"
                >
                    View All
                </Link>
            </div>

            {/* Mobile: Horizontal Scroll | Desktop: Grid */}
            <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4 lg:pb-0 max-w-7xl mx-auto">
                {loading
                    ? [...Array(3)].map((_, i) => (
                        <PropertyCardSkeleton
                            key={i}
                            className="min-w-[85%] sm:min-w-[45%] lg:min-w-0 snap-center"
                        />
                    ))
                    : properties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            className="min-w-[85%] sm:min-w-[45%] lg:min-w-0 snap-center"
                        />
                    ))}
            </div>
            {!loading && properties.length === 0 && (
                <HomepageEmptyState variant="recommended" cityName={selectedCity} />
            )}
        </section>
    );
}
