"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/PropertyCardSkeleton";
import { fetchRecentProperties } from "@/lib/supabase/homepage";
import type { Property, PropertyType } from "@/types";

interface SimilarPropertiesSectionProps {
    currentId: string;
    propertyType: PropertyType;
    city: string;
}

export function SimilarPropertiesSection({ currentId, propertyType, city }: SimilarPropertiesSectionProps) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        // Fetch recent properties and filter client-side by same type + city
        fetchRecentProperties(12).then((all) => {
            if (!cancelled) {
                const similar = all
                    .filter((p) => p.id !== currentId && p.type === propertyType && p.city === city)
                    .slice(0, 3);

                // If not enough same-city matches, fall back to same type only
                const results = similar.length >= 1
                    ? similar
                    : all.filter((p) => p.id !== currentId && p.type === propertyType).slice(0, 3);

                setProperties(results);
                setLoading(false);
            }
        });
        return () => { cancelled = true; };
    }, [currentId, propertyType, city]);

    if (!loading && properties.length === 0) return null;

    return (
        <section className="py-8 bg-bg-card overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">Similar Properties</h3>
                <Link href="/search" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                    View All
                </Link>
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div className="-mx-4 px-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:hidden">
                <div className="flex gap-4 w-max">
                    {loading
                        ? [...Array(2)].map((_, i) => (
                            <div key={i} className="w-[280px] flex-shrink-0 snap-start">
                                <PropertyCardSkeleton />
                            </div>
                        ))
                        : properties.map((property) => (
                            <div key={property.id} className="w-[280px] flex-shrink-0 snap-start">
                                <PropertyCard property={property} />
                            </div>
                        ))}
                </div>
            </div>

            {/* Tablet + Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {loading
                    ? [...Array(3)].map((_, i) => <PropertyCardSkeleton key={i} />)
                    : properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
            </div>
        </section>
    );
}
