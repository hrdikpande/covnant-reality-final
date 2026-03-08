"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AgentCard } from "./AgentCard";
import { AgentCardSkeleton } from "./AgentCardSkeleton";
import { fetchTopAgents } from "@/lib/supabase/homepage";
import { useCity } from "@/components/CityContext";
import { HomepageEmptyState } from "./HomepageEmptyState";
import type { Agent } from "@/types";

export function TopAgents() {
    const { selectedCity } = useCity();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [prevCity, setPrevCity] = useState(selectedCity);

    if (selectedCity !== prevCity) {
        setPrevCity(selectedCity);
        setLoading(true);
    }

    useEffect(() => {
        let cancelled = false;
        // setLoading(true); // Handled during rendering
        fetchTopAgents(8, selectedCity || undefined)
            .then((data) => {
                if (!cancelled) setAgents(data);
            })
            .catch((err) => console.error("[TopAgents] fetch error:", err))
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [selectedCity]);

    return (
        <section className="py-12 lg:py-20 bg-white">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
                        Top Agents
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 mt-1">
                        Meet our real estate experts{selectedCity ? ` in ${selectedCity}` : ""}
                    </p>
                </div>
                <Link
                    href="/search"
                    className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                    aria-label="See all agents"
                >
                    See All Agents
                </Link>
            </div>

            {/* Mobile: Horizontal Scroll | Desktop: Grid */}
            <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4 lg:pb-0 max-w-7xl mx-auto">
                {loading
                    ? [...Array(4)].map((_, i) => (
                        <AgentCardSkeleton
                            key={i}
                            className="min-w-[75%] sm:min-w-[40%] lg:min-w-0 snap-center lg:snap-align-none"
                        />
                    ))
                    : agents.map((agent) => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            className="min-w-[75%] sm:min-w-[40%] lg:min-w-0 snap-center lg:snap-align-none"
                        />
                    ))}
            </div>
            {!loading && agents.length === 0 && (
                <HomepageEmptyState variant="agent" cityName={selectedCity} />
            )}
        </section>
    );
}
