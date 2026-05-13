"use client";

import { useState } from "react";
import {
    Building2,
    Home,
    Briefcase,
    ChevronDown,
    TrendingUp,
    ShoppingBag,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PropertyStats } from "@/lib/supabase/admin";

interface PropertyOverviewDashboardProps {
    stats: PropertyStats | null;
    loading: boolean;
}

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
}: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
}) {
    return (
        <div className="bg-white border border-border rounded-2xl shadow-sm p-5 flex flex-col gap-3 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-secondary">{title}</span>
                <div className={cn("p-2.5 rounded-xl", color)}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div>
                <span className="text-3xl font-bold text-text-primary tabular-nums">
                    {value.toLocaleString()}
                </span>
                {subtitle && (
                    <p className="text-xs text-text-muted mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
}

function CategoryCard({
    title,
    total,
    subtypes,
    icon: Icon,
    accentColor,
    badgeColor,
}: {
    title: string;
    total: number;
    subtypes: Record<string, number>;
    icon: React.ElementType;
    accentColor: string;
    badgeColor: string;
}) {
    const [expanded, setExpanded] = useState(false);
    const sortedSubtypes = Object.entries(subtypes).sort(([, a], [, b]) => b - a);

    return (
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
            {/* Card Header — always visible */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-5 text-left group transition-colors hover:bg-slate-50/50"
            >
                <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl", accentColor)}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-text-primary">{title}</span>
                        <span className="text-xs text-text-muted mt-0.5">
                            {sortedSubtypes.length} subtypes
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={cn(
                        "text-2xl font-bold tabular-nums",
                        total > 0 ? "text-text-primary" : "text-text-muted"
                    )}>
                        {total.toLocaleString()}
                    </span>
                    <div className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        expanded ? "bg-slate-100" : "bg-transparent group-hover:bg-slate-100"
                    )}>
                        <ChevronDown className={cn(
                            "w-4 h-4 text-text-muted transition-transform duration-300",
                            expanded && "rotate-180"
                        )} />
                    </div>
                </div>
            </button>

            {/* Expandable subtypes list */}
            <div
                className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-border">
                        {sortedSubtypes.map(([name, count], idx) => (
                            <div
                                key={name}
                                className={cn(
                                    "flex items-center justify-between px-5 py-3 transition-colors hover:bg-slate-50",
                                    idx < sortedSubtypes.length - 1 && "border-b border-slate-50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full shrink-0 transition-colors",
                                        count > 0 ? "bg-green-500" : "bg-slate-300"
                                    )} />
                                    <span className={cn(
                                        "text-sm",
                                        count > 0
                                            ? "text-text-primary font-medium"
                                            : "text-text-muted"
                                    )}>
                                        {name}
                                    </span>
                                </div>
                                <span className={cn(
                                    "text-sm font-semibold tabular-nums px-2.5 py-0.5 rounded-lg",
                                    count > 0
                                        ? `${badgeColor}`
                                        : "bg-slate-50 text-slate-400"
                                )}>
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function PropertyOverviewDashboard({ stats, loading }: PropertyOverviewDashboardProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {/* Skeleton stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white border border-border rounded-2xl shadow-sm p-5 animate-pulse">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-4 w-24 bg-slate-200 rounded" />
                                <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                            </div>
                            <div className="h-9 w-16 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>
                {/* Skeleton category cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="bg-white border border-border rounded-2xl shadow-sm p-5 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 w-32 bg-slate-200 rounded" />
                                    <div className="h-3 w-20 bg-slate-200 rounded" />
                                </div>
                                <div className="h-8 w-12 bg-slate-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-4">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Total Properties"
                    value={stats.total}
                    icon={Building2}
                    color="bg-primary/10 text-primary"
                    subtitle="All listings combined"
                />
                <StatCard
                    title="For Sale"
                    value={stats.byListingType.sell}
                    icon={TrendingUp}
                    color="bg-emerald-100 text-emerald-700"
                    subtitle="Buy listings"
                />
                <StatCard
                    title="For Rent"
                    value={stats.byListingType.rent}
                    icon={ShoppingBag}
                    color="bg-violet-100 text-violet-700"
                    subtitle="Rental listings"
                />
            </div>

            {/* Category Breakdown Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CategoryCard
                    title="Residential"
                    total={stats.byCategory.residential.total}
                    subtypes={stats.byCategory.residential.subtypes}
                    icon={Home}
                    accentColor="bg-blue-100 text-blue-700"
                    badgeColor="bg-blue-50 text-blue-700"
                />
                <CategoryCard
                    title="Commercial"
                    total={stats.byCategory.commercial.total}
                    subtypes={stats.byCategory.commercial.subtypes}
                    icon={Briefcase}
                    accentColor="bg-amber-100 text-amber-700"
                    badgeColor="bg-amber-50 text-amber-700"
                />
            </div>
        </div>
    );
}
