"use client";

import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "./EmptyState";
import { PropertyCardSkeleton } from "./Skeletons";
import type { SavedPropertyRow } from "./types";
import Link from "next/link";
import Image from "next/image";

interface SavedSectionProps {
    properties: SavedPropertyRow[];
    loading: boolean;
}

export function SavedSection({ properties, loading }: SavedSectionProps) {
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-40 bg-slate-200 animate-pulse rounded-lg" />
                    <div className="h-7 w-20 bg-slate-200 animate-pulse rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <PropertyCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">
                    Saved Properties
                </h2>
                <span className="text-sm font-medium text-text-secondary bg-slate-100 px-3 py-1 rounded-full">
                    {properties.length} saved
                </span>
            </div>

            {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {properties.map((row) => {
                        const p = row.property;
                        const image = p.property_media?.[0]?.media_url;
                        return (
                            <Card key={row.id} hoverable>
                                {image && (
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
                                        <Image
                                            src={image}
                                            alt={p.title}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-text-primary line-clamp-2 mb-1">
                                        {p.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary mb-2">
                                        {p.address}, {p.city}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-primary">
                                            ₹{p.price.toLocaleString("en-IN")}
                                        </span>
                                        <Link
                                            href={`/property/${p.id}`}
                                            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                                        >
                                            View →
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={<Heart className="w-8 h-8" />}
                    title="No saved properties yet"
                    description="Save properties you like to easily compare and revisit them later."
                    actionLabel="Browse Properties"
                    actionHref="/search"
                />
            )}
        </div>
    );
}
