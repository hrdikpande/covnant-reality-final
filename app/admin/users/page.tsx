"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter, AlertCircle, RefreshCcw, Loader2 } from "lucide-react";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { AdminPagination } from "@/components/admin/AdminPagination";
import {
    fetchAdminUsers,
    updateUserVerification,
    type AdminUser,
} from "@/lib/supabase/admin";

const PAGE_SIZE = 20;

export default function UserManagementPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const fetchData = useCallback(async (pageNum: number) => {
        setLoading(true);
        setError(null);
        const offset = pageNum * PAGE_SIZE;
        const { data, totalCount: tc, error: err } = await fetchAdminUsers({
            limit: PAGE_SIZE,
            offset,
        });
        if (err) setError(err);
        else {
            setUsers(data ?? []);
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
            const { data, totalCount: tc, error: err } = await fetchAdminUsers({
                limit: PAGE_SIZE,
                offset,
            });
            if (!isMounted) return;
            if (err) setError(err);
            else {
                setUsers(data ?? []);
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

    const handleVerify = async (userId: string, isVerified: boolean) => {
        const { error: err } = await updateUserVerification(userId, isVerified);
        if (err) {
            setError(err);
            return;
        }
        await fetchData(page);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            (user.full_name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email ?? "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "All" || (user.role ?? "").toLowerCase() === roleFilter.toLowerCase();
        const matchesStatus =
            statusFilter === "All" ||
            (statusFilter === "Verified" && user.is_verified) ||
            (statusFilter === "Unverified" && !user.is_verified);

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">User Management</h1>
                    <p className="text-text-muted text-sm max-w-2xl">
                        View, filter, and manage all users registered on the platform.
                    </p>
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
            <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-text-muted" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Dropdowns */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            className="appearance-none bg-slate-50 border border-border text-text-primary text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary block w-full py-2 pl-3 pr-8 transition-colors cursor-pointer"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="All">All Roles</option>
                            <option value="buyer">Buyers</option>
                            <option value="agent">Agents</option>
                            <option value="builder">Builders</option>
                            <option value="owner">Owners</option>
                            <option value="tenant">Tenants</option>
                            <option value="admin">Admins</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
                            <Filter className="h-3.5 w-3.5" />
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            className="appearance-none bg-slate-50 border border-border text-text-primary text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary block w-full py-2 pl-3 pr-8 transition-colors cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Verified">Verified</option>
                            <option value="Unverified">Unverified</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
                            <Filter className="h-3.5 w-3.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="bg-white border border-border rounded-xl shadow-sm p-8">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-text-muted">Loading users…</p>
                    </div>
                </div>
            ) : (
                <>
                    <AdminUserTable users={filteredUsers} onVerify={handleVerify} />
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
