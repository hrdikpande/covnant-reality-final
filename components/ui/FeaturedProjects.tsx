"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FeaturedProjectCard } from "./FeaturedProjectCard";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import { fetchFeaturedProjects } from "@/lib/supabase/homepage";
import { useCity } from "@/components/CityContext";
import { HomepageEmptyState } from "./HomepageEmptyState";
import type { Project } from "@/types";

export function FeaturedProjects() {
    const { selectedCity } = useCity();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [prevCity, setPrevCity] = useState(selectedCity);

    if (selectedCity !== prevCity) {
        setPrevCity(selectedCity);
        setLoading(true);
    }

    useEffect(() => {
        let cancelled = false;
        // setLoading(true); // Handled during rendering
        fetchFeaturedProjects(6, selectedCity || undefined)
            .then((data) => {
                if (!cancelled) setProjects(data);
            })
            .catch((err) => console.error("[FeaturedProjects] fetch error:", err))
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [selectedCity]);

    return (
        <section className="py-12 lg:py-20 bg-gray-50/50">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">
                        Featured Projects
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 mt-1">
                        Premium developments{selectedCity ? ` in ${selectedCity}` : " by top builders"}
                    </p>
                </div>
                <Link
                    href="/search?type=project"
                    className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                    aria-label="View all featured projects"
                >
                    View All
                </Link>
            </div>

            {/* Mobile: Horizontal Scroll | Desktop: Grid */}
            <div className="flex lg:grid lg:grid-cols-2 gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4 lg:pb-0 max-w-7xl mx-auto">
                {loading
                    ? [...Array(2)].map((_, i) => (
                        <ProjectCardSkeleton
                            key={i}
                            className="min-w-[85%] sm:min-w-[65%] lg:min-w-0 snap-center lg:snap-align-none"
                        />
                    ))
                    : projects.map((project) => (
                        <FeaturedProjectCard
                            key={project.id}
                            project={project}
                            className="min-w-[85%] sm:min-w-[65%] lg:min-w-0 snap-center lg:snap-align-none"
                        />
                    ))}
            </div>
            {!loading && projects.length === 0 && (
                <HomepageEmptyState variant="project" cityName={selectedCity} />
            )}
        </section>
    );
}
