import { cn } from "@/lib/utils";

interface PropertyCardSkeletonProps {
    className?: string;
}

export function PropertyCardSkeleton({ className }: PropertyCardSkeletonProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden",
                className
            )}
        >
            {/* Image placeholder */}
            <div className="aspect-[4/3] bg-slate-200 animate-pulse" />

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Title & location */}
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                    <div className="h-2.5 bg-slate-100 rounded animate-pulse w-1/3" />
                </div>

                {/* Specs row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-border/50">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
                            <div className="h-3 bg-slate-100 rounded animate-pulse w-12" />
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-1">
                    <div className="h-8 bg-slate-100 rounded-lg animate-pulse flex-1" />
                    <div className="h-8 bg-slate-200 rounded-lg animate-pulse flex-1" />
                </div>
            </div>
        </div>
    );
}
