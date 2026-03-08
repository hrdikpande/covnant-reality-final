"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Presentation, CheckCircle } from "lucide-react";
import { getPerformanceSnapshot, type PerformanceSnapshot } from "@/lib/supabase/agent-dashboard";

export function PerformanceStats() {
    const [snapshot, setSnapshot] = useState<PerformanceSnapshot | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getPerformanceSnapshot()
            .then((data) => {
                if (!cancelled) setSnapshot(data);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
        );
    }

    const items = [
        {
            label: "Leads This Week",
            value: snapshot?.leadsThisWeek ?? 0,
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            label: "Conversion Rate",
            value: `${snapshot?.conversionRate ?? 0}%`,
            icon: Presentation,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            label: "Visits Completed",
            value: snapshot?.visitsCompleted ?? 0,
            icon: CheckCircle,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            {items.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-border bg-white">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <span className="text-sm font-medium text-text-secondary">{item.label}</span>
                        </div>
                        <span className="text-lg font-bold text-text-primary">{item.value}</span>
                    </div>
                );
            })}
        </div>
    );
}
