import { TrainTrack, School, Hospital, ShoppingBag } from "lucide-react";

// Nearby places are not stored in the DB — we show a generic city-aware placeholder
// so at least the city name is correct. A future enhancement could use a Places API.
const NEARBY_TEMPLATES = [
    { label: "Metro / Railway Station", icon: TrainTrack },
    { label: "School / College", icon: School },
    { label: "Hospital", icon: Hospital },
    { label: "Shopping Mall", icon: ShoppingBag },
];

export function NearbySection() {
    return (
        <section className="py-6 border-b border-border bg-bg-card">
            <h3 className="text-lg font-bold text-text-primary mb-4">Nearby</h3>

            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-6">
                {NEARBY_TEMPLATES.map((place, index) => {
                    const Icon = place.icon;
                    return (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-border flex-shrink-0">
                                    <Icon className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                                </div>
                                <span className="text-sm font-medium text-text-primary">{place.label}</span>
                            </div>
                            <span className="text-sm font-medium text-text-muted bg-slate-50 px-2.5 py-1 rounded-xl border border-border">
                                Nearby
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
