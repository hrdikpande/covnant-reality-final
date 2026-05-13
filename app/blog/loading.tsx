export default function BlogLoading() {
    return (
        <main className="bg-bg min-h-screen animate-pulse">
            {/* Hero Section Skeleton */}
            <section className="bg-gradient-to-br from-primary/5 via-bg to-accent/5 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb skeleton */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-4 w-12 bg-slate-200 rounded" />
                        <div className="h-4 w-3 bg-slate-200 rounded" />
                        <div className="h-4 w-10 bg-slate-300 rounded" />
                    </div>
                    {/* Title skeleton */}
                    <div className="h-10 md:h-14 w-72 md:w-96 bg-slate-200 rounded-xl mb-6" />
                    {/* Description skeleton */}
                    <div className="space-y-2 max-w-3xl">
                        <div className="h-5 w-full bg-slate-200/70 rounded-lg" />
                        <div className="h-5 w-3/4 bg-slate-200/70 rounded-lg" />
                    </div>
                </div>
            </section>

            {/* Blog Grid Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col"
                        >
                            {/* Image skeleton */}
                            <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-100" />
                            {/* Content skeleton */}
                            <div className="p-6 flex flex-col flex-1 space-y-3">
                                <div className="h-5 w-full bg-slate-200 rounded-lg" />
                                <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-3.5 w-full bg-slate-100 rounded" />
                                    <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
                                    <div className="h-3.5 w-2/3 bg-slate-100 rounded" />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-20 bg-slate-100 rounded" />
                                        <div className="h-3 w-16 bg-slate-100 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
