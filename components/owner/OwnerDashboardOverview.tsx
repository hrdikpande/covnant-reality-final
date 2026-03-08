"use client";

import { useEffect, useState } from "react";
import { Building2, CheckCircle2, Clock, Users, ArrowRight } from "lucide-react";
import { getOwnerDashboardStats, OwnerDashboardStats } from "@/lib/supabase/owner";
import { useAuth } from "@/components/AuthContext";
import type { OwnerDashboardTabId } from "./types";

interface OwnerDashboardOverviewProps {
    onTabChange: (tab: OwnerDashboardTabId) => void;
}

export function OwnerDashboardOverview({ onTabChange }: OwnerDashboardOverviewProps) {
    const { user } = useAuth();
    const [stats, setStats] = useState<OwnerDashboardStats>({
        totalProperties: 0,
        activeListings: 0,
        pendingApproval: 0,
        totalLeads: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            const data = await getOwnerDashboardStats(user.id);
            setStats(data);
            setIsLoading(false);
        };
        fetchStats();
    }, [user]);

    if (isLoading) {
        return <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
            </div>
        </div>;
    }

    const STAT_CARDS = [
        {
            title: "Total Properties",
            value: stats.totalProperties,
            icon: Building2,
            color: "text-blue-600",
            bg: "bg-blue-50",
            onClick: () => onTabChange("properties")
        },
        {
            title: "Active Listings",
            value: stats.activeListings,
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-50",
            onClick: () => onTabChange("properties")
        },
        {
            title: "Pending Approval",
            value: stats.pendingApproval,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
            onClick: () => onTabChange("properties")
        },
        {
            title: "Total Leads",
            value: stats.totalLeads,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
            onClick: () => onTabChange("leads")
        }
    ];

    return (
        <div className="flex flex-col gap-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {STAT_CARDS.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
                            onClick={stat.onClick}
                            className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-secondary">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-3xl font-bold text-text-primary mt-2">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                View details <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Getting Started</h3>
                        <p className="text-sm text-text-secondary mt-1">Quick actions to manage your portfolio</p>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => onTabChange("add-property")}
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-text-primary">Add New Property</span>
                        <span className="text-sm text-text-secondary mt-1">List a property for sale or rent</span>
                    </button>

                    <button
                        onClick={() => onTabChange("profile")}
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-text-primary">Complete Profile</span>
                        <span className="text-sm text-text-secondary mt-1">Update your contact details for leads</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
