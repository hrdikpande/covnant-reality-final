"use client";

import { Search, Trash2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "./EmptyState";
import { CardSkeleton } from "./Skeletons";
import type { SavedSearch } from "./types";

interface SearchesSectionProps {
    searches: SavedSearch[];
    loading: boolean;
}

/** Turn the JSONB filters into readable tags */
function formatFilters(filters: Record<string, unknown>): string[] {
    const tags: string[] = [];
    if (filters.city) tags.push(String(filters.city));
    if (filters.listing_type) tags.push(String(filters.listing_type));
    if (filters.bedrooms) tags.push(`${filters.bedrooms} BHK`);

    if (filters.is_verified) tags.push("Verified");
    if (filters.sort_by) tags.push(`Sort: ${String(filters.sort_by).replace("_", " ")}`);
    if (tags.length === 0) tags.push("All Properties");
    return tags;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function SearchesSection({ searches, loading }: SearchesSectionProps) {
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-40 bg-slate-200 animate-pulse rounded-lg" />
                    <div className="h-7 w-24 bg-slate-200 animate-pulse rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">
                    Saved Searches
                </h2>
                <span className="text-sm font-medium text-text-secondary bg-slate-100 px-3 py-1 rounded-full">
                    {searches.length} searches
                </span>
            </div>

            {searches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {searches.map((search) => {
                        const tags = formatFilters(search.filters);
                        const displayLabel = search.label || (search.filters.city ? String(search.filters.city) : "Custom Search");
                        return (
                            <Card key={search.id} hoverable>
                                <CardContent className="p-4 sm:p-5">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className="font-semibold text-text-primary text-lg">
                                            {displayLabel}
                                        </h3>
                                        <button
                                            aria-label={`Delete search for ${displayLabel}`}
                                            className="p-1.5 text-text-muted hover:text-danger hover:bg-red-50 rounded-lg transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                                        {tags.join(" • ")}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Saved {timeAgo(search.created_at)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={<Search className="w-8 h-8" />}
                    title="No saved searches yet"
                    description="Save your search criteria to get notified when new matching properties are listed."
                    actionLabel="Start a Search"
                    actionHref="/search"
                />
            )}
        </div>
    );
}
