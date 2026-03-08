import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { FormData } from "./PostPropertyContent";

interface Step2PropertyDetailsPart1Props {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    showErrors?: boolean;
}

const PROPERTY_TYPES = [
    "Apartment",
    "House",
    "Villa",
    "Plot",
    "Commercial",
];

const BHK_OPTIONS = [
    "1 BHK",
    "2 BHK",
    "3 BHK",
    "4 BHK",
    "5+ BHK",
];

const COMMERCIAL_TYPES = [
    "Office",
    "Retail Shop",
    "Warehouse",
    "Industrial Land",
    "Showroom",
    "Commercial Plot",
    "Co-working Space",
    "Hotel",
    "Other",
];

export function Step2PropertyDetailsPart1({ formData, updateFormData, showErrors }: Step2PropertyDetailsPart1Props) {
    // Local state for dropdown toggles (using simple custom selects for consistent styling)
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isBhkOpen, setIsBhkOpen] = useState(false);
    const [isCommercialTypeOpen, setIsCommercialTypeOpen] = useState(false);

    const handleSelectType = (type: string) => {
        updateFormData({ propertyType: type, ...(type !== "Commercial" ? { commercialType: undefined } : {}) });
        setIsTypeOpen(false);
    };

    const handleSelectBhk = (bhk: string) => {
        updateFormData({ bhk });
        setIsBhkOpen(false);
    };

    const handleSelectCommercialType = (commercialType: string) => {
        updateFormData({ commercialType });
        setIsCommercialTypeOpen(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="mb-2">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-text-primary">
                    Property Details
                </h3>
                <p className="text-sm md:text-base text-text-secondary mt-1">
                    Tell us the basic details about your property.
                </p>
            </div>

            <div className="flex flex-col gap-6 md:gap-8">
                {/* 1. Sell or Rent (Radio Group) */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-primary">
                        Listing Type
                    </label>
                    <div className="flex gap-4">
                        <label className={cn(
                            "flex-1 flex items-center justify-center py-3 rounded-xl border-2 transition-all cursor-pointer",
                            formData.listingType === "Sell"
                                ? "border-primary bg-primary/5 text-primary font-semibold"
                                : "border-border bg-white text-text-secondary hover:border-primary/30 hover:bg-slate-50"
                        )}>
                            <input
                                type="radio"
                                name="listingType"
                                value="Sell"
                                checked={formData.listingType === "Sell"}
                                onChange={(e) => updateFormData({ listingType: e.target.value })}
                                className="sr-only"
                            />
                            Sell
                        </label>
                        <label className={cn(
                            "flex-1 flex items-center justify-center py-3 rounded-xl border-2 transition-all cursor-pointer",
                            formData.listingType === "Rent"
                                ? "border-primary bg-primary/5 text-primary font-semibold"
                                : "border-border bg-white text-text-secondary hover:border-primary/30 hover:bg-slate-50"
                        )}>
                            <input
                                type="radio"
                                name="listingType"
                                value="Rent"
                                checked={formData.listingType === "Rent"}
                                onChange={(e) => updateFormData({ listingType: e.target.value })}
                                className="sr-only"
                            />
                            Rent
                        </label>
                    </div>
                </div>

                {/* 2. Property Type + 3. BHK — 2-col on md */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* 2. Property Type */}
                    <div className="flex flex-col gap-2 relative z-20">
                        <label className="text-sm font-medium text-text-primary">
                            Property Type
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                setIsTypeOpen(!isTypeOpen);
                                setIsBhkOpen(false);
                            }}
                            className={cn(
                                "flex items-center justify-between w-full h-12 px-4 bg-white border rounded-xl text-left transition-colors",
                                isTypeOpen ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50",
                                !formData.propertyType && "text-text-muted"
                            )}
                        >
                            <span>{formData.propertyType || "Select property type"}</span>
                            <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform", isTypeOpen && "rotate-180")} />
                        </button>
                        {isTypeOpen && (
                            <div className="absolute top-[76px] left-0 w-full bg-white border border-border rounded-xl shadow-lg overflow-hidden py-1 z-30">
                                {PROPERTY_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleSelectType(type)}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                        {showErrors && !formData.propertyType && (
                            <p className="text-xs text-danger mt-1">Please select a property type.</p>
                        )}
                    </div>

                    {/* 3. BHK (Custom Dropdown) */}
                    <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-sm font-medium text-text-primary">
                            BHK Type
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                setIsBhkOpen(!isBhkOpen);
                                setIsTypeOpen(false);
                            }}
                            disabled={formData.propertyType === "Plot" || formData.propertyType === "Commercial"}
                            className={cn(
                                "flex items-center justify-between w-full h-12 px-4 bg-white border rounded-xl text-left transition-colors",
                                isBhkOpen ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50",
                                (!formData.bhk || formData.propertyType === "Plot" || formData.propertyType === "Commercial") && "text-text-muted",
                                (formData.propertyType === "Plot" || formData.propertyType === "Commercial") && "bg-slate-50 opacity-60 cursor-not-allowed"
                            )}
                        >
                            <span>
                                {formData.propertyType === "Plot" || formData.propertyType === "Commercial"
                                    ? "Not applicable"
                                    : formData.bhk || "Select BHK"}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform", isBhkOpen && "rotate-180")} />
                        </button>
                        {isBhkOpen && (
                            <div className="absolute top-[76px] left-0 w-full bg-white border border-border rounded-xl shadow-lg overflow-hidden py-1 z-30">
                                {BHK_OPTIONS.map((bhk) => (
                                    <button
                                        key={bhk}
                                        type="button"
                                        onClick={() => handleSelectBhk(bhk)}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                                    >
                                        {bhk}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div> {/* end PropertyType + BHK 2-col grid */}

                {/* Commercial Property Type (visible only when Commercial is selected) */}
                {formData.propertyType === "Commercial" && (
                    <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-sm font-medium text-text-primary">
                            Commercial Property Type
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCommercialTypeOpen(!isCommercialTypeOpen);
                                setIsTypeOpen(false);
                                setIsBhkOpen(false);
                            }}
                            className={cn(
                                "flex items-center justify-between w-full h-12 px-4 bg-white border rounded-xl text-left transition-colors",
                                isCommercialTypeOpen ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50",
                                !formData.commercialType && "text-text-muted"
                            )}
                        >
                            <span>{formData.commercialType || "Select commercial type"}</span>
                            <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform", isCommercialTypeOpen && "rotate-180")} />
                        </button>
                        {isCommercialTypeOpen && (
                            <div className="absolute top-[76px] left-0 w-full bg-white border border-border rounded-xl shadow-lg overflow-hidden py-1 z-30">
                                {COMMERCIAL_TYPES.map((ct) => (
                                    <button
                                        key={ct}
                                        type="button"
                                        onClick={() => handleSelectCommercialType(ct)}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                                    >
                                        {ct}
                                    </button>
                                ))}
                            </div>
                        )}
                        {showErrors && !formData.commercialType && (
                            <p className="text-xs text-danger mt-1">Please select a commercial property type.</p>
                        )}
                    </div>
                )}

                {/* 4. Area + 5. Price + 6. Bathrooms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* 4. Area (Input) */}
                    <div className="relative">
                        <Input
                            label="Built-up Area"
                            type="number"
                            placeholder="e.g., 1200"
                            min={0}
                            value={formData.area || ""}
                            onChange={(e) => updateFormData({ area: e.target.value })}
                            rightIcon={
                                <select
                                    className="text-sm font-medium text-text-muted bg-transparent border-l border-border h-6 outline-none cursor-pointer pl-2 pr-1 appearance-none"
                                    value={formData.areaUnit || "Sq ft"}
                                    onChange={(e) => updateFormData({ areaUnit: e.target.value })}
                                >
                                    <option value="Sq ft">Sq ft</option>
                                    <option value="Sq yd">Sq yd</option>
                                    <option value="Sq m">Sq m</option>
                                    <option value="Acre">Acre</option>
                                    <option value="Hectare">Hectare</option>
                                </select>
                            }
                            className="h-12 pr-20"
                        />
                        {showErrors && !formData.area && (
                            <p className="text-xs text-danger mt-1">Please enter the built-up area.</p>
                        )}
                    </div>

                    {/* 5. Price (Input) */}
                    <div className="relative">
                        <Input
                            label="Expected Price"
                            type="number"
                            placeholder="e.g., 5000000"
                            min={0}
                            value={formData.price || ""}
                            onChange={(e) => updateFormData({ price: e.target.value })}
                            leftIcon={<span className="text-sm font-medium text-text-muted">₹</span>}
                            className="h-12 pl-8"
                        />
                        {showErrors && !formData.price && (
                            <p className="text-xs text-danger mt-1">Please enter the expected price.</p>
                        )}
                    </div>

                    {/* 6. Bathrooms (Input) */}
                    <div className="relative">
                        <Input
                            label="Bathrooms"
                            type="number"
                            placeholder="e.g., 2"
                            min={0}
                            value={formData.bathrooms || ""}
                            onChange={(e) => updateFormData({ bathrooms: e.target.value })}
                            className="h-12"
                        />
                    </div>
                </div> {/* end Area + Price + Bathrooms grid */}
            </div>
        </div>
    );
}
