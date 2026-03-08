"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminPaginationProps {
    page: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

export function AdminPagination({
    page,
    pageSize,
    totalCount,
    onPageChange,
    loading = false,
}: AdminPaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const from = totalCount === 0 ? 0 : page * pageSize + 1;
    const to = Math.min((page + 1) * pageSize, totalCount);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-4">
            <p className="text-sm text-text-muted">
                {totalCount === 0
                    ? "No results"
                    : `Showing ${from}–${to} of ${totalCount}`}
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 0 || loading}
                    className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border transition-colors",
                        page === 0 || loading
                            ? "text-text-muted bg-slate-50 cursor-not-allowed opacity-50"
                            : "text-text-primary bg-white hover:bg-slate-50"
                    )}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                </button>

                <span className="text-sm font-medium text-text-secondary px-2">
                    {page + 1} / {totalPages}
                </span>

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page + 1 >= totalPages || loading}
                    className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border transition-colors",
                        page + 1 >= totalPages || loading
                            ? "text-text-muted bg-slate-50 cursor-not-allowed opacity-50"
                            : "text-text-primary bg-white hover:bg-slate-50"
                    )}
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
