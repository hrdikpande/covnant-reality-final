"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Users,
    UserCheck,
    Building2,
    Clock,
    Target,
    TrendingUp,
    UserPlus,
    FileText,
    Shield,
    Flag,
    AlertCircle,
    RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    fetchAdminAnalytics,
    fetchActivityLogs,
    type AdminAnalytics,
    type AdminActivityLog,
} from "@/lib/supabase/admin";

/* ── Action → Icon/label map for activity logs ────────────── */
const ACTION_META: Record<string, { icon: typeof Users; label: string }> = {
    property_submitted: { icon: FileText, label: "Property Submitted" },
    property_approved: { icon: Shield, label: "Property Approved" },
    property_boosted: { icon: TrendingUp, label: "Property Boosted" },
    lead_status_updated: { icon: Flag, label: "Lead Status Updated" },
    site_visit_booked: { icon: UserPlus, label: "Site Visit Booked" },
    site_visit_confirmed: { icon: UserCheck, label: "Site Visit Confirmed" },
    site_visit_cancelled: { icon: Flag, label: "Site Visit Cancelled" },
};

function getActionMeta(action: string) {
    return ACTION_META[action] ?? { icon: FileText, label: action.replace(/_/g, " ") };
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function AdminPage() {
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [activities, setActivities] = useState<AdminActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        const [analyticsRes, activityRes] = await Promise.all([
            fetchAdminAnalytics(),
            fetchActivityLogs(5),
        ]);

        if (analyticsRes.error) {
            setError(analyticsRes.error);
        } else {
            setAnalytics(analyticsRes.data);
        }

        if (activityRes.data) {
            setActivities(activityRes.data);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            const [analyticsRes, activityRes] = await Promise.all([
                fetchAdminAnalytics(),
                fetchActivityLogs(5),
            ]);

            if (!isMounted) return;

            if (analyticsRes.error) {
                setError(analyticsRes.error);
            } else {
                setAnalytics(analyticsRes.data);
            }

            if (activityRes.data) {
                setActivities(activityRes.data);
            }

            setLoading(false);
        };
        init();
        return () => { isMounted = false; };
    }, []);

    /* ── Stat cards config ────────────────────────────────────── */
    const stats = analytics
        ? [
            { title: "Total Users", value: analytics.totalUsers.toLocaleString(), icon: Users },
            { title: "Total Listings", value: analytics.totalProperties.toLocaleString(), icon: Building2 },
            { title: "Pending Approvals", value: analytics.pendingApprovals.toLocaleString(), icon: Clock },
            { title: "Total Leads", value: analytics.totalLeads.toLocaleString(), icon: Target },
        ]
        : [];

    /* ── Render ────────────────────────────────────────────────── */
    return (
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">Dashboard Overview</h1>
                    <p className="text-text-muted text-sm max-w-2xl">
                        Welcome to your administrative control center. Here is your platform&apos;s summary.
                    </p>
                </div>
                <button
                    onClick={load}
                    disabled={loading}
                    className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                    <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* Error banner */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Stat cards */}
            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white border border-border rounded-xl shadow-sm p-4 md:p-5 animate-pulse">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-4 w-24 bg-slate-200 rounded" />
                                <div className="w-9 h-9 bg-slate-200 rounded-lg" />
                            </div>
                            <div className="h-8 w-20 bg-slate-200 rounded mt-4" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-2">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white border border-border flex flex-col rounded-xl shadow-sm p-4 md:p-5 transition-all hover:shadow-md"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-text-secondary line-clamp-1">{stat.title}</span>
                                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                    <stat.icon className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                            <div className="mt-auto">
                                <span className="text-2xl md:text-3xl font-bold text-text-primary block">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Recent Activity */}
            <div className="mt-8">
                <h2 className="text-xl font-bold tracking-tight text-text-primary mb-4">Recent Activity</h2>
                {loading ? (
                    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                        <ul className="divide-y divide-border">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <li key={i} className="p-4 flex items-center gap-4 animate-pulse">
                                    <div className="w-9 h-9 bg-slate-200 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-40 bg-slate-200 rounded" />
                                        <div className="h-3 w-20 bg-slate-200 rounded" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="bg-white border border-border rounded-xl shadow-sm p-8 text-center text-text-muted">
                        <FileText className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                        <p className="text-sm font-medium">No recent activity</p>
                    </div>
                ) : (
                    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                        <ul className="divide-y divide-border">
                            {activities.map((activity) => {
                                const meta = getActionMeta(activity.action);
                                const Icon = meta.icon;

                                return (
                                    <li
                                        key={activity.id}
                                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-start sm:items-center gap-4">
                                            <div className="p-2 bg-slate-100 rounded-lg shrink-0">
                                                <Icon className="w-5 h-5 text-text-secondary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-text-primary">{meta.label}</p>
                                                <p className="text-xs text-text-muted mt-0.5">
                                                    {activity.user_name ?? "System"} · {timeAgo(activity.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 sm:self-center ml-12 sm:ml-0">
                                            <span className="px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold rounded-full bg-slate-100 text-slate-600">
                                                {activity.entity_type}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
