import { MapPin, Navigation } from "lucide-react";
import type { Property } from "@/types";

interface MapSectionProps {
    property: Property;
}

export function MapSection({ property }: MapSectionProps) {
    const { title, location, city, state, latitude, longitude } = property;
    const fullAddress = [location, city, state].filter(Boolean).join(", ");

    let mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    let mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

    if (latitude && longitude) {
        mapEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }

    return (
        <section className="py-6 border-b border-border bg-bg-card">
            <h3 className="text-lg font-bold text-text-primary mb-4">Location</h3>

            <div className="rounded-xl overflow-hidden border border-border">
                {/* Google Maps Embed */}
                <div className="w-full h-[200px] md:h-[280px] lg:h-[350px] bg-bg relative flex items-center justify-center overflow-hidden">
                    <iframe
                        title={`Map of ${title}`}
                        src={mapEmbedUrl}
                        className="w-full h-full absolute inset-0 border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                {/* Info & Action */}
                <div className="p-4 bg-bg flex flex-col gap-4">
                    <div className="flex gap-3">
                        <div className="bg-bg-card border border-border w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                            <MapPin className="w-5 h-5 text-text-muted" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-primary text-sm mb-0.5">{title}</h4>
                            <p className="text-xs text-text-secondary leading-relaxed">{fullAddress}</p>
                        </div>
                    </div>

                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-bg-card border border-border text-text-primary font-medium rounded-xl text-sm hover:bg-slate-50 shadow-sm transition-colors"
                    >
                        <Navigation className="w-4 h-4 text-primary" />
                        Open in Google Maps
                    </a>
                </div>
            </div>
        </section>
    );
}
