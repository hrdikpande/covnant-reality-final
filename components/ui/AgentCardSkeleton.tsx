import { cn } from "@/lib/utils";

interface AgentCardSkeletonProps {
    className?: string;
}

export function AgentCardSkeleton({ className }: AgentCardSkeletonProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-3xl border border-border/60 shadow-sm p-6 flex flex-col items-center text-center",
                className
            )}
        >
            {/* Avatar */}
            <div className="w-24 h-24 mb-4 rounded-full bg-slate-200 animate-pulse" />

            {/* Content */}
            <div className="space-y-3 w-full">
                <div className="space-y-2 flex flex-col items-center">
                    <div className="h-5 bg-slate-200 rounded animate-pulse w-28" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-36" />
                </div>

                <div className="flex items-center justify-center gap-4 py-3 border-y border-border/50">
                    <div className="flex flex-col items-center gap-1">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-10" />
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-16" />
                    </div>
                    <div className="w-px h-8 bg-border/50" />
                    <div className="flex flex-col items-center gap-1">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-10" />
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-16" />
                    </div>
                </div>

                <div className="pt-2">
                    <div className="h-9 bg-slate-100 rounded-lg animate-pulse w-full" />
                </div>
            </div>
        </div>
    );
}
