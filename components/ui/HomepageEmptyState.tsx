"use client";

import { Building2, Home, Users, Briefcase, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type EmptyVariant = "property" | "rental" | "project" | "agent" | "verified" | "recommended";

const VARIANT_CONFIG: Record<EmptyVariant, {
    icon: typeof Building2;
    title: string;
    cta: string;
    ctaHref: string;
    gradient: string;
    iconBg: string;
    iconColor: string;
}> = {
    property: {
        icon: Home,
        title: "No properties found",
        cta: "Browse All Properties",
        ctaHref: "/search",
        gradient: "from-blue-50 to-indigo-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-500",
    },
    rental: {
        icon: Building2,
        title: "No rentals found",
        cta: "Explore Rentals",
        ctaHref: "/search?type=rent",
        gradient: "from-emerald-50 to-teal-50",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-500",
    },
    project: {
        icon: Briefcase,
        title: "No projects found",
        cta: "View All Projects",
        ctaHref: "/search?type=project",
        gradient: "from-violet-50 to-purple-50",
        iconBg: "bg-violet-100",
        iconColor: "text-violet-500",
    },
    agent: {
        icon: Users,
        title: "No agents found",
        cta: "See All Agents",
        ctaHref: "/search",
        gradient: "from-amber-50 to-orange-50",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-500",
    },
    verified: {
        icon: Search,
        title: "No verified properties found",
        cta: "Browse Verified",
        ctaHref: "/search",
        gradient: "from-green-50 to-emerald-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-500",
    },
    recommended: {
        icon: Search,
        title: "No recommendations yet",
        cta: "Discover Properties",
        ctaHref: "/search",
        gradient: "from-sky-50 to-blue-50",
        iconBg: "bg-sky-100",
        iconColor: "text-sky-500",
    },
};

interface EmptyStateProps {
    variant: EmptyVariant;
    cityName?: string;
    className?: string;
}

export function HomepageEmptyState({ variant, cityName, className }: EmptyStateProps) {
    const config = VARIANT_CONFIG[variant];
    const Icon = config.icon;
    const locationSuffix = cityName ? ` in ${cityName}` : "";

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-14 px-6 mx-4 sm:mx-6 lg:mx-8 rounded-2xl",
                `bg-gradient-to-br ${config.gradient}`,
                "border border-white/60",
                className
            )}
        >
            {/* Animated icon ring */}
            <div className={cn(
                "flex items-center justify-center w-16 h-16 rounded-2xl mb-4",
                config.iconBg,
                "shadow-sm"
            )}>
                <Icon className={cn("h-7 w-7", config.iconColor)} strokeWidth={1.5} />
            </div>

            <h3 className="text-base font-semibold text-slate-700 mb-1">
                {config.title}{locationSuffix}
            </h3>
            <p className="text-sm text-slate-500 mb-5 text-center max-w-xs">
                Try selecting a different city or check back later for new listings.
            </p>

            <Link
                href={config.ctaHref}
                className={cn(
                    "inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-medium",
                    "bg-white text-slate-700 shadow-sm border border-slate-200",
                    "hover:bg-slate-50 hover:shadow-md hover:border-slate-300",
                    "transition-all duration-200 active:scale-[0.97]"
                )}
            >
                <Search className="h-3.5 w-3.5" />
                {config.cta}
            </Link>
        </div>
    );
}
