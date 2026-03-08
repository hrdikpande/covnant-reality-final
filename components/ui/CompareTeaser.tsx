import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";

export function CompareTeaser() {
    return (
        <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-sm">
                <div className="flex items-center gap-4 text-center sm:text-left w-full sm:w-auto flex-col sm:flex-row">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                        <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            Compare up to 3 Properties Side-by-Side
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Make confident decisions by comparing features, prices, and locations.
                        </p>
                    </div>
                </div>
                <Link
                    href="/search"
                    className="whitespace-nowrap w-full sm:w-auto bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 font-medium px-5 py-2.5 rounded-lg text-sm sm:text-base transition-colors shadow-sm text-center"
                >
                    Start Comparing
                </Link>
            </div>
        </section>
    );
}
