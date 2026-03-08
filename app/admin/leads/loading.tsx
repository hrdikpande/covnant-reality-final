export default function LeadsLoading() {
    return (
        <div className="w-full flex-1 p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md" />
                    <div className="h-4 w-72 bg-slate-100 animate-pulse rounded-md" />
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-24 bg-slate-200 animate-pulse rounded-lg" />
                    <div className="h-10 w-32 bg-slate-200 animate-pulse rounded-lg" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-border p-5 h-28 animate-pulse flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200" />
                        <div className="space-y-2 w-full">
                            <div className="h-6 w-1/2 bg-slate-200 rounded" />
                            <div className="h-4 w-3/4 bg-slate-100 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full bg-white rounded-xl border border-border animate-pulse flex flex-col">
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="h-10 flex-1 sm:max-w-[320px] bg-slate-100 rounded-lg" />
                    <div className="h-10 w-24 bg-slate-100 rounded-lg hidden sm:block" />
                </div>
                <div className="p-4 space-y-4 min-h-[400px]">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-14 w-full bg-slate-50 border border-slate-100 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}
