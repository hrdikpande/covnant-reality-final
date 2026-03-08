"use client";

import { Building, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "./EmptyState";
import { CardSkeleton } from "./Skeletons";
import type { LeadRow, LeadStatus } from "./types";
import type { BadgeVariant } from "@/types";

const STATUS_VARIANT: Record<LeadStatus, BadgeVariant> = {
    new: "warning",
    contacted: "default",
    visited: "success",
    closed: "outline",
};

const STATUS_LABEL: Record<LeadStatus, string> = {
    new: "New",
    contacted: "Contacted",
    visited: "Visited",
    closed: "Closed",
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

interface LeadsSectionProps {
    leads: LeadRow[];
    loading: boolean;
}

export function LeadsSection({ leads, loading }: LeadsSectionProps) {
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-28 bg-slate-200 animate-pulse rounded-lg" />
                    <div className="h-7 w-20 bg-slate-200 animate-pulse rounded-full" />
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
                    My Leads
                </h2>
                <span className="text-sm font-medium text-text-secondary bg-slate-100 px-3 py-1 rounded-full">
                    {leads.length} leads
                </span>
            </div>

            {leads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {leads.map((lead) => (
                        <Card key={lead.id} hoverable>
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <h3 className="font-semibold text-text-primary line-clamp-2">
                                        {lead.property?.title ?? "Unknown Property"}
                                    </h3>
                                    <Badge
                                        variant={STATUS_VARIANT[lead.status]}
                                        className="shrink-0"
                                    >
                                        {STATUS_LABEL[lead.status]}
                                    </Badge>
                                </div>
                                <div className="flex flex-col gap-2 text-sm text-text-secondary mb-4">
                                    <span className="flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        Agent: {lead.agent?.full_name ?? "Unassigned"}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        Submitted: {formatDate(lead.created_at)}
                                    </span>
                                </div>
                                <div className="pt-3 border-t border-border">
                                    <Button variant="secondary" size="sm" fullWidth>
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<Building className="w-8 h-8" />}
                    title="No leads submitted"
                    description="You haven&apos;t contacted any agents or submitted queries for properties yet."
                    actionLabel="Browse Properties"
                    actionHref="/search"
                />
            )}
        </div>
    );
}
