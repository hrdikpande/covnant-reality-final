"use client";

import { useEffect, useState, useCallback } from "react";
import { Target, AlertCircle, RefreshCcw, Loader2 } from "lucide-react";
import { AdminLeadsTable } from "@/components/admin/AdminLeadsTable";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { fetchAdminLeads, type AdminLead } from "@/lib/supabase/admin";

const PAGE_SIZE = 20;

export default function LeadMonitoringPage() {
    const [leads, setLeads] = useState<AdminLead[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("");

    const fetchData = useCallback(async (pageNum: number) => {
        setLoading(true);
        setError(null);
        const offset = pageNum * PAGE_SIZE;
        const { data, totalCount: tc, error: err } = await fetchAdminLeads({
            limit: PAGE_SIZE,
            offset,
        });
        if (err) setError(err);
        else {
            setLeads(data ?? []);
            setTotalCount(tc);
        }
        setLoading(false);
    }, []);

    const handleRefresh = useCallback(async () => {
        await fetchData(page);
    }, [fetchData, page]);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            const offset = page * PAGE_SIZE;
            const { data, totalCount: tc, error: err } = await fetchAdminLeads({
                limit: PAGE_SIZE,
                offset,
            });
            if (!isMounted) return;
            if (err) setError(err);
            else {
                setLeads(data ?? []);
                setTotalCount(tc);
            }
            setLoading(false);
        };
        init();
        return () => { isMounted = false; };
    }, [page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const filteredLeads = leads.filter((lead) => {
        if (statusFilter && lead.status !== statusFilter) return false;
        return true;
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary tracking-tight">Lead Monitoring</h1>
                    <p className="text-text-muted mt-1 text-sm">Track and manage prospective buyers and tenant inquiries.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl border border-border flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        Status
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white hover:bg-slate-50 cursor-pointer appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="visited">Visited</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="bg-white border border-border rounded-xl shadow-sm p-8">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-text-muted">Loading leads…</p>
                    </div>
                </div>
            ) : (
                <>
                    <AdminLeadsTable leads={filteredLeads} />
                    <AdminPagination
                        page={page}
                        pageSize={PAGE_SIZE}
                        totalCount={totalCount}
                        onPageChange={handlePageChange}
                        loading={loading}
                    />
                </>
            )}
        </div>
    );
}
