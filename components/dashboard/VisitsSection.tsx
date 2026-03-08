"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "./EmptyState";
import { CardSkeleton } from "./Skeletons";
import type { SiteVisitRow, VisitStatus } from "./types";
import type { BadgeVariant } from "@/types";

const STATUS_VARIANT: Record<VisitStatus, BadgeVariant> = {
    requested: "warning",
    confirmed: "default",
    completed: "success",
    cancelled: "danger",
};

const STATUS_LABEL: Record<VisitStatus, string> = {
    requested: "Requested",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(timeStr: string): string {
    // time comes as HH:MM:SS, display as 10:30 AM
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const amPm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${amPm}`;
}

interface VisitsSectionProps {
    visits: SiteVisitRow[];
    loading: boolean;
}

export function VisitsSection({ visits, loading }: VisitsSectionProps) {
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-slate-200 animate-pulse rounded-lg" />
                    <div className="h-7 w-20 bg-slate-200 animate-pulse rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
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
                    Site Visits
                </h2>
                <span className="text-sm font-medium text-text-secondary bg-slate-100 px-3 py-1 rounded-full">
                    {visits.length} visits
                </span>
            </div>

            {visits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {visits.map((visit) => {
                        const image = visit.property?.property_media?.[0]?.media_url;
                        return (
                            <div
                                key={visit.id}
                                className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-xl overflow-hidden shrink-0">
                                    {image ? (
                                        <Image
                                            src={image}
                                            alt={visit.property?.title ?? "Property"}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <CalendarDays className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 sm:hidden">
                                        <Badge variant={STATUS_VARIANT[visit.status]}>
                                            {STATUS_LABEL[visit.status]}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-col justify-between flex-1 min-w-0">
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold text-text-primary line-clamp-2">
                                                {visit.property?.title ?? "Property"}
                                            </h3>
                                            <div className="hidden sm:block shrink-0">
                                                <Badge variant={STATUS_VARIANT[visit.status]}>
                                                    {STATUS_LABEL[visit.status]}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary mb-3">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays className="w-4 h-4" />
                                                {formatDate(visit.visit_date)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {formatTime(visit.visit_time)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                                        <Link
                                            href={`/property/${visit.property_id}`}
                                            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                                        >
                                            View Property
                                        </Link>
                                        {(visit.status === "requested" || visit.status === "confirmed") && (
                                            <Button variant="danger" size="sm">
                                                Cancel Visit
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={<CalendarDays className="w-8 h-8" />}
                    title="No site visits scheduled"
                    description="Book a site visit to experience properties in person before making a decision."
                    actionLabel="Explore Properties"
                    actionHref="/search"
                />
            )}
        </div>
    );
}
