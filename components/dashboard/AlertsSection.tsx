"use client";

import { BellRing, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "./EmptyState";
import { CardSkeleton } from "./Skeletons";
import type { AlertRow, AlertFrequency } from "./types";

const FREQ_LABEL: Record<AlertFrequency, string> = {
    instant: "Instant",
    daily: "Daily",
    weekly: "Weekly",
};

interface AlertsSectionProps {
    alerts: AlertRow[];
    loading: boolean;
}

export function AlertsSection({ alerts, loading }: AlertsSectionProps) {
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="h-6 w-40 bg-slate-200 animate-pulse rounded-lg mb-2" />
                        <div className="h-4 w-64 bg-slate-200 animate-pulse rounded-lg" />
                    </div>
                    <div className="h-10 w-32 bg-slate-200 animate-pulse rounded-lg" />
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">
                        Property Alerts
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Get notified when new properties match your criteria
                    </p>
                </div>
                <Button leftIcon={<BellRing className="w-4 h-4" />} className="shrink-0">
                    Create Alert
                </Button>
            </div>

            {alerts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {alerts.map((alert) => (
                        <Card key={alert.id} hoverable>
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <BellRing className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-text-primary">
                                            {alert.title}
                                        </h3>
                                    </div>
                                    <button
                                        aria-label={`Delete alert: ${alert.title}`}
                                        className="p-1.5 text-text-muted hover:text-danger hover:bg-red-50 rounded-lg transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{FREQ_LABEL[alert.frequency]}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-xs font-medium ${alert.active
                                                ? "text-primary"
                                                : "text-text-muted"
                                                }`}
                                        >
                                            {alert.active ? "Active" : "Paused"}
                                        </span>
                                        <button
                                            aria-label={`Toggle alert: ${alert.title}`}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${alert.active
                                                ? "bg-primary"
                                                : "bg-slate-200"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alert.active
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<BellRing className="w-8 h-8" />}
                    title="No active alerts"
                    description="Set up alerts to be the first to know when properties matching your criteria hit the market."
                    actionLabel="Create Your First Alert"
                    actionHref="/search"
                />
            )}
        </div>
    );
}
