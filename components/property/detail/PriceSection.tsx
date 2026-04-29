import { MapPin } from "lucide-react";
import type { Property } from "@/types";
import { useMemo } from "react";
import { AREA_UNITS, AreaUnit, convertFromSqft } from "@/utils/areaConversion";
import { formatPropertyTitle } from "@/lib/utils";

interface PriceSectionProps {
    property: Property;
    displayUnit: AreaUnit;
    setDisplayUnit: (unit: AreaUnit) => void;
}

function formatPrice(price: number): string {
    if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹ ${(price / 100000).toFixed(1)} L`;
    return `₹ ${price.toLocaleString("en-IN")}`;
}

function formatEmi(price: number): string {
    // Rough EMI estimate: 20yr loan @ 8.5% on 80% of price
    const principal = price * 0.8;
    const rate = 8.5 / 12 / 100;
    const n = 240;
    if (rate === 0) return "N/A";
    const emi = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    if (emi >= 100000) return `₹ ${(emi / 100000).toFixed(1)} L/mo`;
    return `₹ ${Math.round(emi).toLocaleString("en-IN")}/mo`;
}

export function PriceSection({ property, displayUnit, setDisplayUnit }: PriceSectionProps) {
    const { title, price, location, city, state, bedrooms, area, furnishing, listingType } = property;

    // Fallback to area if area_sqft is undefined
    const baseAreaSqft = area || 0;

    const displayArea = useMemo(() => {
        return convertFromSqft(baseAreaSqft, displayUnit);
    }, [baseAreaSqft, displayUnit]);

    const displayPricePerUnit = useMemo(() => {
        if (displayArea === 0 || price === 0) return null;
        return Math.round(price / displayArea);
    }, [displayArea, price]);

    return (
        <section className="py-4 border-b border-border bg-bg-card">
            {/* Price & EMI */}
            <div className="mb-3">
                <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">
                    {formatPrice(price)}
                    {listingType === "rent" && <span className="text-lg font-medium text-text-muted"> / month</span>}
                </h2>
                {listingType !== "rent" && (
                    <div className="flex flex-col gap-0.5 mt-0.5">
                        <p className="text-sm text-text-muted">EMI starts at {formatEmi(price)}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-medium text-text-muted">
                                {displayPricePerUnit ? `₹ ${displayPricePerUnit.toLocaleString("en-IN")} per ${displayUnit}` : "Price per unit: N/A"}
                            </p>
                            <select
                                className="text-sm font-medium text-primary bg-primary/5 rounded-md border border-primary/20 px-2 py-0.5 outline-none cursor-pointer appearance-none"
                                value={displayUnit}
                                onChange={(e) => setDisplayUnit(e.target.value as AreaUnit)}
                            >
                                {AREA_UNITS.map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Title & Location */}
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-text-primary leading-tight mb-1.5 capitalize">
                    {formatPropertyTitle(property)}
                </h1>
                <div className="flex items-start text-text-secondary gap-1.5">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm leading-snug">
                        {[location, city, state].filter(Boolean).join(", ")}
                    </p>
                </div>
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-2">
                {bedrooms > 0 && (
                    <span className="px-2.5 py-1 bg-bg border border-border text-text-secondary text-xs font-medium rounded-xl">
                        {bedrooms} BHK
                    </span>
                )}
                {baseAreaSqft > 0 && (
                    <span className="px-2.5 py-1 bg-bg border border-border text-text-secondary text-xs font-medium rounded-xl">
                        {displayArea.toLocaleString(undefined, { maximumFractionDigits: 2 })} {displayUnit}
                    </span>
                )}
                {furnishing && (
                    <span className="px-2.5 py-1 bg-bg border border-border text-text-secondary text-xs font-medium rounded-xl capitalize">
                        {furnishing.replace("_", " ")}
                    </span>
                )}
                {property.possessionStatus && (
                    <span className="px-2.5 py-1 bg-accent/10 text-accent-hover border border-accent/20 text-xs font-medium rounded-xl">
                        {property.possessionStatus}
                    </span>
                )}
            </div>
        </section>
    );
}
