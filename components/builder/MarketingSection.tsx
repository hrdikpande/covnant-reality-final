import { Rocket, Star, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export function MarketingSection({ isLoading }: { isLoading?: boolean }) {
  return (
    <section aria-label="Marketing and promotions">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        Marketing &amp; Promotions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-bg-card rounded-2xl border border-border p-6 h-[260px] flex flex-col justify-between"
            >
              <div>
                <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="space-y-1.5 mb-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))
        ) : (
          <>
            {/* Boost Project */}
            <div className="bg-bg-card rounded-2xl border border-border p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
              <div>
                <div
                  className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200"
                  aria-hidden="true"
                >
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  Boost Project Visibility
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  Appear at the top of search results and increase lead
                  generation by 3x for your upcoming projects.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full justify-center group-hover:border-primary group-hover:text-primary transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <Rocket className="w-4 h-4 mr-2" aria-hidden="true" />
                Boost Project
              </Button>
            </div>

            {/* Featured Slot */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
              <div
                className="absolute top-0 right-0 p-4 opacity-10"
                aria-hidden="true"
              >
                <Star className="w-24 h-24 text-white" />
              </div>
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl bg-white/10 text-yellow-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200"
                  aria-hidden="true"
                >
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Featured Project Slot
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Highlight your premium project on the homepage. Secure maximum
                  impressions from verified buyers.
                </p>
              </div>
              <Button
                variant="primary"
                className="w-full justify-center bg-white text-slate-900 border-white hover:bg-slate-100 flex items-center relative z-10 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <Star className="w-4 h-4 mr-2" aria-hidden="true" />
                Book Featured Slot
              </Button>
            </div>

            {/* Banner Placement */}
            <div className="bg-bg-card rounded-2xl border border-border p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
              <div>
                <div
                  className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200"
                  aria-hidden="true"
                >
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  Banner Placement
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  Showcase your brand with custom hero banners on category pages
                  and newsletter sponsorships.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full justify-center group-hover:border-purple-600 group-hover:text-purple-600 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:outline-none"
              >
                <Megaphone className="w-4 h-4 mr-2" aria-hidden="true" />
                Contact Sales
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
