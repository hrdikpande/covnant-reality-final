export default function SalesLoading() {
    return (
        <div className="w-full flex-1 p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-32 bg-slate-200 animate-pulse rounded-md" />
                    <div className="h-4 w-64 bg-slate-100 animate-pulse rounded-md" />
                </div>
                <div className="h-10 w-32 bg-slate-200 animate-pulse rounded-lg" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-border p-5 h-32 animate-pulse">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-200" />
                            <div className="w-16 h-6 rounded-full bg-slate-100" />
                        </div>
                        <div className="space-y-2 mt-4">
                            <div className="h-4 w-24 bg-slate-100 rounded" />
                            <div className="h-8 w-32 bg-slate-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pipeline Skeleton */}
            <div className="mt-6">
                <div className="flex justify-between mb-4">
                    <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
                    <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />
                </div>

                <div className="flex flex-col lg:flex-row gap-4 overflow-hidden pb-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex-none w-full lg:w-[320px] lg:flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 h-[500px] animate-pulse">
                            <div className="flex justify-between mb-4 px-1">
                                <div className="h-5 w-24 bg-slate-200 rounded" />
                                <div className="h-5 w-8 bg-slate-200 rounded-full" />
                            </div>
                            <div className="space-y-3">
                                {[...Array((i % 3) + 2)].map((_, j) => (
                                    <div key={j} className="h-32 bg-white rounded-lg border border-slate-100 w-full" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full bg-white rounded-xl border border-border animate-pulse flex flex-col mt-6">
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="h-10 flex-1 sm:max-w-[320px] bg-slate-100 rounded-lg" />
                </div>
                <div className="p-4 space-y-4 min-h-[300px]">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 w-full bg-slate-50 border border-slate-100 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}
