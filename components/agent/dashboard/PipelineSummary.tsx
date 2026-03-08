"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getPipelineStats, type PipelineCounts } from "@/lib/supabase/agent-dashboard";

export function PipelineSummary() {
    const [stats, setStats] = useState<PipelineCounts | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getPipelineStats()
            .then((data) => {
                if (!cancelled) setStats(data);
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

    const stages = [
        { label: "New", count: stats?.new ?? 0, color: "bg-blue-500", text: "text-blue-600" },
        { label: "Contacted", count: stats?.contacted ?? 0, color: "bg-yellow-400", text: "text-yellow-600" },
        { label: "Visit Scheduled", count: stats?.visitScheduled ?? 0, color: "bg-purple-500", text: "text-purple-600" },
        { label: "Negotiation", count: stats?.negotiation ?? 0, color: "bg-orange-500", text: "text-orange-600" },
        { label: "Closed", count: stats?.closed ?? 0, color: "bg-emerald-500", text: "text-emerald-600" },
        { label: "Lost", count: stats?.lost ?? 0, color: "bg-red-500", text: "text-red-600" },
    ];

    const maxCount = Math.max(...stages.map(s => s.count), 1);

    return (
        <div className="flex flex-col gap-4">
            {stages.map((stage) => {
                const pct = Math.round((stage.count / maxCount) * 100);
                return (
                    <div key={stage.label} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-text-primary">{stage.label}</span>
                            <span className={`font-bold ${stage.text}`}>{stage.count} leads</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${stage.color}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
