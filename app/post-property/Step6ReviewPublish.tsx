import { User, Building2, HardHat, Home, MapPin, Maximize2, IndianRupee, Zap } from "lucide-react";

import { FormData } from "./PostPropertyContent";

interface Step6ReviewPublishProps {
    formData: FormData;
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
    Owner: <User className="w-4 h-4" />,
    Agent: <Building2 className="w-4 h-4" />,
    Builder: <HardHat className="w-4 h-4" />,
};

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-1.5">
            <div className="mt-0.5 text-text-muted shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <span className="text-xs text-text-muted">{label}</span>
                <p className="text-sm font-medium text-text-primary truncate">{value}</p>
            </div>
        </div>
    );
}

export function Step6ReviewPublish({ formData }: Step6ReviewPublishProps) {

    const formatPrice = (price?: string | number) => {
        if (price === undefined) return undefined;
        const num = Number(price);
        if (!num) return undefined;
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
        return `₹${num.toLocaleString("en-IN")}`;
    };

    const locationParts = [formData.locality, formData.city, formData.state].filter(Boolean).join(", ");
    const specsParts = [formData.bhk, formData.bathrooms ? `${formData.bathrooms} Bath` : undefined, formData.area ? `${formData.area} sq.ft` : undefined, formData.facing].filter(Boolean).join(" · ");

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-text-primary">
                    Review & Publish
                </h3>
                <p className="text-sm md:text-base text-text-secondary mt-1">
                    Review your listing before it goes live.
                </p>
            </div>

            {/* Single column layout for summary */}
            <div className="flex flex-col gap-6 lg:gap-8 lg:items-center">

                {/* 1. Summary Card */}
                <div className="bg-slate-50 border border-border rounded-2xl overflow-hidden w-full max-w-2xl">
                    <div className="px-5 py-3 bg-white border-b border-border flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-text-primary">Listing Summary</h4>
                        {formData.listingType && (
                            <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                                {formData.listingType}
                            </span>
                        )}
                    </div>

                    <div className="px-5 py-2 divide-y divide-border">
                        <SummaryRow
                            icon={(formData.role && ROLE_ICONS[formData.role]) ?? <User className="w-4 h-4" />}
                            label="Posted As"
                            value={formData.role}
                        />
                        <SummaryRow
                            icon={<Home className="w-4 h-4" />}
                            label="Property Type"
                            value={[formData.propertyType, formData.bhk].filter(Boolean).join(" · ")}
                        />
                        <SummaryRow
                            icon={<IndianRupee className="w-4 h-4" />}
                            label="Expected Price"
                            value={formatPrice(formData.price)}
                        />
                        <SummaryRow
                            icon={<MapPin className="w-4 h-4" />}
                            label="Location"
                            value={locationParts || formData.address}
                        />
                        <SummaryRow
                            icon={<Maximize2 className="w-4 h-4" />}
                            label="Key Specs"
                            value={specsParts || undefined}
                        />
                        {formData.amenities && formData.amenities.length > 0 && (
                            <div className="flex items-start gap-3 py-1.5">
                                <div className="mt-0.5 text-text-muted shrink-0">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs text-text-muted">Amenities</span>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {formData.amenities.map((a: string) => (
                                            <span key={a} className="px-2 py-0.5 bg-white border border-border rounded-full text-xs font-medium text-text-secondary">
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div> {/* end single layout */}
        </div>
    );
}
