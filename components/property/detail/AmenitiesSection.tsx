import { CarFront, ArrowUpDown, Dumbbell, ShieldCheck, Zap, TreePine, Waves, CheckCircle2, LucideIcon } from "lucide-react";
import { Property } from "@/types";

interface AmenitiesSectionProps {
    property: Property;
}

const AMENITY_ICONS: Record<string, LucideIcon> = {
    "Parking": CarFront,
    "Lift": ArrowUpDown,
    "Gym": Dumbbell,
    "Security": ShieldCheck,
    "Power Backup": Zap,
    "Garden": TreePine,
    "Pool": Waves,
};

export function AmenitiesSection({ property }: AmenitiesSectionProps) {
    const amenities = property.amenities || [];

    if (amenities.length === 0) return null;

    return (
        <section className="py-6 border-b border-border bg-bg-card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">Amenities</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-4">
                {amenities.map((amenityName, index) => {
                    const Icon = AMENITY_ICONS[amenityName] || CheckCircle2;
                    return (
                        <div key={index} className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-border flex-shrink-0">
                                <Icon className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                            </div>
                            <span className="text-sm font-medium text-text-secondary">{amenityName}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
