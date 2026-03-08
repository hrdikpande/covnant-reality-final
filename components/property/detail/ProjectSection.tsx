import { Building2, ShieldCheck, CalendarClock } from "lucide-react";
import type { Property } from "@/types";

interface ProjectSectionProps {
    property: Property;
}

export function ProjectSection({ property }: ProjectSectionProps) {
    const { title, type, possessionStatus, city } = property;

    // If the property has no possession or project context, skip the section
    if (!possessionStatus && !city) return null;

    const isResidential = ["apartment", "villa", "house", "pg"].includes(type);

    return (
        <section className="py-6 border-b border-border bg-bg-card">
            <h3 className="text-lg font-bold text-text-primary mb-4">Project Details</h3>

            <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-semibold text-text-primary text-base mb-1">{title}</h4>
                        <p className="text-xs text-text-muted line-clamp-2 pr-4">
                            Located in {city}, this {type} listing offers a great opportunity for buyers.
                        </p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                        <div className="flex items-center gap-1 bg-accent/10 text-accent px-2.5 py-1 rounded-xl border border-accent/20">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold tracking-wide">VERIFIED</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-border my-4" />

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-text-muted font-medium mb-0.5 uppercase tracking-wider">Property Type</p>
                            <p className="text-sm font-semibold text-text-primary capitalize">
                                {isResidential ? "Residential" : "Commercial"}
                            </p>
                        </div>
                    </div>

                    {possessionStatus && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center flex-shrink-0">
                                <CalendarClock className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-text-muted font-medium mb-0.5 uppercase tracking-wider">Possession</p>
                                <p className="text-sm font-semibold text-text-primary">{possessionStatus}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
