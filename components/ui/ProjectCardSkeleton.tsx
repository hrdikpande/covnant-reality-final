import { cn } from "@/lib/utils";

interface ProjectCardSkeletonProps {
    className?: string;
}

export function ProjectCardSkeleton({ className }: ProjectCardSkeletonProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-3xl border border-border shadow-md overflow-hidden",
                className
            )}
        >
            {/* Image placeholder */}
            <div className="aspect-[16/9] bg-slate-200 animate-pulse" />

            {/* Content */}
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded animate-pulse w-2/3" />
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-1/3" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-border/50">
                    <div className="space-y-1">
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-16" />
                        <div className="h-5 bg-slate-200 rounded animate-pulse w-24" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-12" />
                        <div className="h-5 bg-slate-200 rounded animate-pulse w-28" />
                    </div>
                </div>
            </div>
        </div>
    );
}
