export function BannerAds() {
    return (
        <section className="py-12 lg:py-20 bg-white">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">

                {/* Large Banner Card */}
                <div className="relative w-full aspect-[21/9] bg-slate-100 rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer flex items-center justify-center">
                    {/* Placeholder Content */}
                    <div className="text-center space-y-2 px-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto animate-pulse" />
                        <h3 className="text-lg sm:text-2xl font-semibold text-text-primary">
                            Special Offer: Get 20% off Premium Listings
                        </h3>
                        <p className="text-sm text-text-secondary">
                            Limited time offer for new agents and developers.
                        </p>
                    </div>

                    {/* Sponsored Badge */}
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                        Sponsored
                    </div>

                    {/* Subtle Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                </div>

                {/* Small Stacked Banners */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Small Banner 1 */}
                    <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-slate-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer flex items-center justify-center">
                        <div className="text-center px-4">
                            <h4 className="text-base font-medium text-text-primary mb-1">
                                Interior Design Partners
                            </h4>
                            <p className="text-xs text-text-muted">
                                Transform your space
                            </p>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                            Ad
                        </div>
                    </div>

                    {/* Small Banner 2 */}
                    <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-slate-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer flex items-center justify-center">
                        <div className="text-center px-4">
                            <h4 className="text-base font-medium text-text-primary mb-1">
                                Home Loan Offers
                            </h4>
                            <p className="text-xs text-text-muted">
                                Starts at 8.2% p.a.
                            </p>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                            Ad
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
