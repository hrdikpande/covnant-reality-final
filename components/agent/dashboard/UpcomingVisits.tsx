"use client";

import { useState, useEffect } from "react";
import { Loader2, CalendarClock, MapPin } from "lucide-react";
import { getUpcomingVisits, type AgentMeetingRow } from "@/lib/supabase/agent-dashboard";

export function UpcomingVisits() {
    const [visits, setVisits] = useState<AgentMeetingRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getUpcomingVisits()
            .then((data) => {
                if (!cancelled) setVisits(data);
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
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
        );
    }

    if (visits.length === 0) {
        return (
            <div className="text-center py-8">
                <CalendarClock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-text-secondary">No upcoming visits scheduled.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {visits.map((visit) => {
                const d = new Date(`${visit.visit_date}T${visit.visit_time}`);
                const dateStr = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                const timeStr = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

                return (
                    <div key={visit.id} className="flex flex-col sm:flex-row lg:flex-col 2xl:flex-row sm:items-center lg:items-start 2xl:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-white hover:border-primary/30 transition-colors">
                        <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-text-primary">{visit.buyer?.full_name || "Unknown Lead"}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${visit.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'
                                    }`}>
                                    {visit.status === 'confirmed' ? 'Confirmed' : 'Requested'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span className="truncate max-w-full sm:max-w-xs">{visit.property?.title || "Property"}</span>
                            </div>
                        </div>
                        <div className="flex flex-row sm:flex-col lg:flex-row 2xl:flex-col items-center sm:items-end lg:items-center 2xl:items-end justify-between sm:justify-center lg:justify-between 2xl:justify-center gap-1 w-full sm:w-auto lg:w-full 2xl:w-auto shrink-0">
                            <span className="text-xs font-medium text-text-secondary">{dateStr}</span>
                            <span className="text-sm font-bold text-primary">{timeStr}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
