import { Maximize2 } from "lucide-react";
import type { Property } from "@/types";

interface FloorPlanSectionProps {
    property: Property;
}

export function FloorPlanSection({ property }: FloorPlanSectionProps) {
    const { bedrooms, area, type } = property;

    // Plots and commercial units don't have traditional floor plans
    if (type === "plot") return null;

    const label = bedrooms > 0 ? `${bedrooms} BHK` : type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <section className="py-6 border-b border-border bg-bg-card">
            <h3 className="text-lg font-bold text-text-primary mb-4">Floor Plan</h3>

            <div className="border border-border rounded-2xl p-4 bg-bg-card">
                <h4 className="font-semibold text-text-primary mb-1">
                    {label}{area > 0 ? ` • ${area.toLocaleString()} sq.ft.` : ""}
                </h4>
                <p className="text-sm text-text-muted mb-4">Super Built-up Area</p>

                {/* Decorative placeholder — real floor plan would require a separate media type */}
                <div className="relative w-full aspect-[4/3] bg-bg-card border border-border rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 bg-bg" />

                    {/* Grid overlay */}
                    <div className="absolute inset-0 border-[0.5px] border-primary/10 grid grid-cols-6 grid-rows-4">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className="border-[0.5px] border-primary/10" />
                        ))}
                    </div>

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-bg-card/90 rounded-full shadow-sm flex items-center justify-center text-text-primary">
                            <Maximize2 className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Label */}
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                        <span className="text-xs text-text-muted bg-bg-card/80 px-3 py-1 rounded-full">
                            Floor plan not uploaded
                        </span>
                    </div>
                </div>

                <button className="w-full py-2.5 bg-primary-light text-primary font-medium rounded-xl text-sm border border-primary/20 hover:bg-primary/10 transition-colors">
                    Request Floor Plan
                </button>
            </div>
        </section>
    );
}
