"use client";

import { useEffect, useState, useCallback } from "react";
import { BarChart3, TrendingUp, Users, MapPin, AlertCircle, RefreshCcw, Building2, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchAdminAnalytics, type AdminAnalytics } from "@/lib/supabase/admin";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        return await fetchAdminAnalytics();
    }, []);

    const handleRefresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error: err } = await fetchData();
        if (err) setError(err);
        else setAnalytics(data);
        setLoading(false);
    }, [fetchData]);

    useEffect(() => {
        let isMounted = true;
        fetchData().then(({ data, error: err }) => {
            if (!isMounted) return;
            if (err) setError(err);
            else setAnalytics(data);
            setLoading(false);
        });
        return () => { isMounted = false; };
    }, [fetchData]);

    return (
        <div className="w-full flex-1 p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Analytics Overview</h1>
                    <p className="text-sm text-text-muted mt-1">Key metrics and performance trends for Covnant Reality India PVT LTD.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                    <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="space-y-6">
                    {/* Skeleton for stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white border border-border rounded-xl p-5 shadow-sm animate-pulse">
                                <div className="w-10 h-10 bg-slate-200 rounded-lg mb-4" />
                                <div className="h-4 w-20 bg-slate-200 rounded mb-2" />
                                <div className="h-7 w-16 bg-slate-200 rounded" />
                            </div>
                        ))}
                    </div>
                    {/* Skeleton for cities */}
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm animate-pulse h-[200px]" />
                </div>
            ) : analytics ? (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: "Total Users", value: analytics.totalUsers.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                            { title: "Total Properties", value: analytics.totalProperties.toLocaleString(), icon: Building2, color: "text-green-600", bg: "bg-green-50" },
                            { title: "Total Leads", value: analytics.totalLeads.toLocaleString(), icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
                        ].map((stat) => (
                            <div key={stat.title} className="bg-white border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-medium text-text-secondary text-sm">{stat.title}</h3>
                                    <div className={cn("p-2 rounded-lg", stat.bg)}>
                                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                                    </div>
                                </div>
                                <span className="text-2xl md:text-3xl font-bold text-text-primary">{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Additional metrics row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pending vs Active */}
                        <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-text-primary">Pending Approvals</h3>
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex items-end gap-3">
                                <span className="text-4xl font-bold text-text-primary">{analytics.pendingApprovals}</span>
                                <span className="text-sm text-text-muted mb-1">properties awaiting review</span>
                            </div>
                        </div>

                        {/* Top Performing Cities */}
                        <div className="md:col-span-2 bg-white border border-border rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-text-primary">Top Performing Cities</h3>
                                <MapPin className="w-4 h-4 text-text-muted" />
                            </div>

                            {analytics.propertiesByCity.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {analytics.propertiesByCity.map((city) => (
                                        <div key={city.city} className="flex flex-col p-3 rounded-lg border border-border bg-slate-50">
                                            <span className="text-xs text-text-muted font-medium mb-1">{city.city}</span>
                                            <span className="font-bold text-text-primary text-lg">{city.count} listings</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-24 text-text-muted text-sm">
                                    No property data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart placeholders */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-border rounded-xl p-5 shadow-sm min-h-[300px] flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-text-primary">Platform Traffic</h3>
                                <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex-1 w-full bg-slate-50 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-text-muted transition-colors hover:bg-slate-100/50">
                                <BarChart3 className="w-8 h-8 mb-3 text-slate-300" />
                                <span className="text-sm font-medium">Traffic Chart Area</span>
                                <span className="text-xs mt-1">Data visualization component will render here</span>
                            </div>
                        </div>

                        <div className="bg-white border border-border rounded-xl p-5 shadow-sm min-h-[300px] flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-text-primary">Leads Trend</h3>
                            </div>
                            <div className="flex-1 w-full bg-slate-50 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-text-muted transition-colors hover:bg-slate-100/50">
                                <TrendingUp className="w-8 h-8 mb-3 text-slate-300" />
                                <span className="text-sm font-medium">Leads Chart Area</span>
                                <span className="text-xs mt-1">Data visualization component will render here</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
