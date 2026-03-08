import type { Property } from "@/types";
import { AreaUnit, convertFromSqft } from "@/utils/areaConversion";

interface OverviewSectionProps {
    property: Property;
    displayUnit: AreaUnit;
}

export function OverviewSection({ property, displayUnit }: OverviewSectionProps) {
    const {
        type,
        commercialType,
        bedrooms,
        bathrooms,
        area,
        floor,
        totalFloors,
        facing,
        possessionStatus,
        furnishing,
    } = property;

    const details = [
        { label: "Property Type", value: type ? type.charAt(0).toUpperCase() + type.slice(1) : "—" },
        type === "commercial" && commercialType ? { label: "Subtype", value: commercialType } : null,
        bedrooms > 0 ? { label: "BHK", value: `${bedrooms} BHK` } : null,
        bathrooms > 0 ? { label: "Bathrooms", value: `${bathrooms} Bath` } : null,
        area > 0 ? {
            label: "Area",
            value: `${convertFromSqft(area, displayUnit).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${displayUnit}`
        } : null,
        floor != null ? { label: "Floor", value: `${floor}${totalFloors ? ` of ${totalFloors}` : ""}` } : null,
        facing ? { label: "Facing", value: facing } : null,
        furnishing ? { label: "Furnishing", value: furnishing.replace("_", " ") } : null,
        possessionStatus ? { label: "Possession", value: possessionStatus } : null,
    ].filter(Boolean) as { label: string; value: string }[];

    if (details.length === 0) return null;

    return (
        <section className="py-2 border-b border-border bg-bg-card">
            <h3 className="text-lg font-bold text-text-primary mb-4">Overview</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4">
                {details.map((detail, index) => (
                    <div
                        key={index}
                        className="flex flex-col border border-border rounded-xl p-3 bg-bg"
                    >
                        <span className="text-xs text-text-muted mb-1 capitalize">{detail.label}</span>
                        <span className="text-sm font-semibold text-text-primary capitalize">{detail.value}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
