import { cn } from "@/lib/utils";

/* ─── Skeleton Primitives ────────────────────────────────────────────────── */

function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-lg bg-slate-200",
                className
            )}
        />
    );
}

/* ─── Card Skeleton ──────────────────────────────────────────────────────── */

export function CardSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "bg-bg-card rounded-2xl border border-border p-5 space-y-4",
                className
            )}
        >
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="pt-3 border-t border-border flex gap-3">
                <Skeleton className="h-8 flex-1 rounded-xl" />
                <Skeleton className="h-8 flex-1 rounded-xl" />
            </div>
        </div>
    );
}

/* ─── Property Card Skeleton ─────────────────────────────────────────────── */

export function PropertyCardSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "bg-bg-card rounded-2xl border border-border overflow-hidden",
                className
            )}
        >
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-border/50">
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                </div>
                <div className="flex gap-2 pt-1">
                    <Skeleton className="h-8 flex-1 rounded-xl" />
                    <Skeleton className="h-8 flex-1 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

// Chat Item Skeleton removed.

/* ─── Profile Skeleton ───────────────────────────────────────────────────── */

export function ProfileSkeleton() {
    return (
        <div className="max-w-3xl space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="p-5 border-b border-border bg-slate-50/50">
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─── Full Dashboard Skeleton ────────────────────────────────────────────── */

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-7 w-20 rounded-full" />
            </div>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
