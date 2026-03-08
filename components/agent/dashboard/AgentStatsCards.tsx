"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Calendar, Handshake, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { getAgentDashboardStats, type DashboardStats } from "@/lib/supabase/agent-dashboard";

export function AgentStatsCards() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getAgentDashboardStats()
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
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
        );
    }

    const cards = [
        {
            title: "Total Leads",
            value: String(stats?.totalLeads ?? 0),
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "New Leads Today",
            value: String(stats?.newLeadsToday ?? 0),
            icon: UserPlus,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "Visits Scheduled",
            value: String(stats?.visitsScheduled ?? 0),
            icon: Calendar,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Closed Deals",
            value: String(stats?.closedDeals ?? 0),
            icon: Handshake,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <Card key={index}>
                        <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-text-secondary">
                                    {card.title}
                                </span>
                                <span className="text-2xl font-bold text-text-primary">
                                    {card.value}
                                </span>
                            </div>
                            <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
