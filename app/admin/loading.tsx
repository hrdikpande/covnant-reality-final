export default function AdminLoading() {
    return (
        <div className="w-full h-full p-4 md:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md" />
                    <div className="h-4 w-72 bg-slate-100 animate-pulse rounded-md" />
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

            <div className="w-full min-h-[400px] bg-white rounded-xl border border-border animate-pulse p-4">
                <div className="h-6 w-48 bg-slate-200 rounded-md mb-6" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 w-full bg-slate-100 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}
