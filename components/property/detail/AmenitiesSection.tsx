import { CarFront, ArrowUpDown, Dumbbell, ShieldCheck, Zap, TreePine, Waves } from "lucide-react";

export function AmenitiesSection() {
    const amenities = [
        { name: "Parking", icon: CarFront },
        { name: "Lift", icon: ArrowUpDown },
        { name: "Gym", icon: Dumbbell },
        { name: "Security", icon: ShieldCheck },
        { name: "Power Backup", icon: Zap },
        { name: "Garden", icon: TreePine },
        { name: "Pool", icon: Waves },
    ];

    return (
        <section className="py-6 border-b border-border bg-bg-card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">Amenities</h3>
                <button className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                    View All
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-4">
                {amenities.map((amenity, index) => {
                    const Icon = amenity.icon;
                    return (
                        <div key={index} className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-border flex-shrink-0">
                                <Icon className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                            </div>
                            <span className="text-sm font-medium text-text-secondary">{amenity.name}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
