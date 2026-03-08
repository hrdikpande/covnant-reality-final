import { useState } from "react";
import { Car, ArrowUpCircle, Dumbbell, ShieldCheck, Zap, TreePine, Waves, Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormData } from "./PostPropertyContent";

interface Step4AmenitiesProps {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
}

const AMENITIES = [
    { id: "Parking", label: "Parking", icon: <Car className="w-6 h-6" /> },
    { id: "Lift", label: "Lift", icon: <ArrowUpCircle className="w-6 h-6" /> },
    { id: "Gym", label: "Gym", icon: <Dumbbell className="w-6 h-6" /> },
    { id: "Security", label: "Security", icon: <ShieldCheck className="w-6 h-6" /> },
    { id: "Power Backup", label: "Power Backup", icon: <Zap className="w-6 h-6" /> },
    { id: "Garden", label: "Garden", icon: <TreePine className="w-6 h-6" /> },
    { id: "Pool", label: "Pool", icon: <Waves className="w-6 h-6" /> },
];

export function Step4Amenities({ formData, updateFormData }: Step4AmenitiesProps) {
    const selectedAmenities: string[] = formData.amenities || [];
    const [customAmenity, setCustomAmenity] = useState("");

    const toggleAmenity = (id: string) => {
        let newAmenities;
        if (selectedAmenities.includes(id)) {
            newAmenities = selectedAmenities.filter((item) => item !== id);
        } else {
            newAmenities = [...selectedAmenities, id];
        }
        updateFormData({ amenities: newAmenities });
    };

    const handleAddCustomAmenity = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!customAmenity.trim()) return;

        // Capitalize the first letter for consistency
        const newAmt = customAmenity.trim().charAt(0).toUpperCase() + customAmenity.trim().slice(1);

        if (!selectedAmenities.includes(newAmt)) {
            updateFormData({ amenities: [...selectedAmenities, newAmt] });
        }
        setCustomAmenity("");
    };

    const handleRemoveCustomAmenity = (amt: string) => {
        updateFormData({ amenities: selectedAmenities.filter((a) => a !== amt) });
    };

    const standardAmenityIds = AMENITIES.map(a => a.id);
    const customAmenities = selectedAmenities.filter(a => !standardAmenityIds.includes(a));

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-text-primary">
                    Amenities & Features
                </h3>
                <p className="text-sm md:text-base text-text-secondary mt-1">
                    Select all the amenities available in and around your property to attract more buyers.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {AMENITIES.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity.id);

                    return (
                        <button
                            key={amenity.id}
                            type="button"
                            onClick={() => toggleAmenity(amenity.id)}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 group text-center h-28 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none",
                                isSelected
                                    ? "border-primary bg-primary/5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] shadow-primary/10"
                                    : "border-border bg-white hover:border-primary/30 hover:bg-slate-50 hover:shadow-sm"
                            )}
                        >
                            <div className={cn(
                                "mb-3 transition-colors duration-200",
                                isSelected ? "text-primary" : "text-text-muted group-hover:text-primary/70"
                            )}>
                                {amenity.icon}
                            </div>
                            <span className={cn(
                                "text-sm font-medium transition-colors",
                                isSelected ? "text-primary font-semibold" : "text-text-primary"
                            )}>
                                {amenity.label}
                            </span>

                            {/* Subtle active indicator dot */}
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200",
                                isSelected ? "bg-primary opacity-100" : "bg-transparent opacity-0"
                            )} />
                        </button>
                    );
                })}
            </div>

            {/* Custom Amenities Section */}
            <div className="mt-8 pt-6 border-t border-border/80">
                <h4 className="text-base font-bold text-text-primary mb-3 text-left">
                    Other Amenities
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg mb-4">
                    <div className="flex-1 w-full">
                        <Input
                            placeholder="e.g. Club House, Tennis Court"
                            value={customAmenity}
                            onChange={(e) => setCustomAmenity(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddCustomAmenity();
                                }
                            }}
                        />
                    </div>
                    <Button
                        type="button"
                        onClick={handleAddCustomAmenity}
                        className="w-full sm:w-auto flex items-center gap-2 px-6 h-12"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </Button>
                </div>

                {customAmenities.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                        {customAmenities.map((amt) => (
                            <div
                                key={amt}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-primary/5 text-primary text-sm font-semibold animate-in fade-in zoom-in-95 duration-200"
                            >
                                <Check className="w-4 h-4" />
                                {amt}
                                <button
                                    onClick={() => handleRemoveCustomAmenity(amt)}
                                    className="p-1 -mr-1 hover:bg-primary/10 rounded-full transition-colors opacity-70 hover:opacity-100"
                                    aria-label="Remove amenity"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
