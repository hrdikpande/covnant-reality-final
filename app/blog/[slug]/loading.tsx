export default function BlogPostLoading() {
    return (
        <main className="bg-bg min-h-screen animate-pulse">
            {/* Header Section Skeleton */}
            <section className="bg-gradient-to-br from-primary/5 via-bg to-accent/5 pt-16 pb-12 border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs skeleton */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-4 w-12 bg-slate-200 rounded" />
                        <div className="h-4 w-3 bg-slate-200 rounded" />
                        <div className="h-4 w-10 bg-slate-200 rounded" />
                        <div className="h-4 w-3 bg-slate-200 rounded" />
                        <div className="h-4 w-32 bg-slate-300 rounded" />
                    </div>

                    <div className="mb-8">
                        {/* Focus keyword badge */}
                        <div className="h-6 w-28 bg-primary/10 rounded-full mb-4" />
                        {/* Title skeleton */}
                        <div className="space-y-3 mb-6">
                            <div className="h-9 md:h-12 w-full bg-slate-200 rounded-xl" />
                            <div className="h-9 md:h-12 w-3/4 bg-slate-200 rounded-xl" />
                        </div>
                        {/* Meta info */}
                        <div className="flex items-center gap-6 border-t border-border pt-6">
                            <div className="h-4 w-32 bg-slate-200 rounded" />
                            <div className="h-4 w-24 bg-slate-200 rounded" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content Skeleton */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* OG Image skeleton */}
                <div className="w-full aspect-[21/9] bg-slate-100 rounded-2xl mb-12 border border-border" />

                {/* Content paragraphs skeleton */}
                <div className="space-y-6">
                    {/* Paragraph 1 */}
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-5/6 bg-slate-200 rounded" />
                        <div className="h-4 w-3/4 bg-slate-200 rounded" />
                    </div>

                    {/* Heading */}
                    <div className="h-7 w-64 bg-slate-300 rounded-lg mt-8" />

                    {/* Paragraph 2 */}
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-4/5 bg-slate-200 rounded" />
                    </div>

                    {/* Heading */}
                    <div className="h-7 w-48 bg-slate-300 rounded-lg mt-8" />

                    {/* Paragraph 3 */}
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-2/3 bg-slate-200 rounded" />
                    </div>
                </div>
            </article>
        </main>
    );
}
