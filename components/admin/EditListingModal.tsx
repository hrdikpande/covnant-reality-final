"use client";

import { X, Loader2, CheckCircle, AlertCircle, Search } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { AdminProperty } from "@/lib/supabase/admin";
import type { Locality } from "@/lib/api/locations";
import {
    fetchPropertyForAdminEdit,
    updateAdminProperty,
    type AdminPropertyEditData,
} from "@/lib/supabase/admin";

/* ── Constants ────────────────────────────────────────────────── */

const LISTING_TYPES = [
    { label: "Sell", value: "sell" },
    { label: "Rent", value: "rent" },
];

const PROPERTY_TYPES = [
    { label: "Apartment", value: "apartment" },
    { label: "Villa", value: "villa" },
    { label: "House", value: "house" },
    { label: "Plot", value: "plot" },
    { label: "Commercial", value: "commercial" },
];

const RESIDENTIAL_SUBTYPES = [
    "Flat/Apartment",
    "Builder Floor",
    "Independent House/Villa",
    "Residential Land",
    "1 RK/ Studio Apartment",
    "Farm House",
    "Serviced Apartments",
];

const COMMERCIAL_SUBTYPES = [
    "Ready to Move Offices",
    "Bare Shell Offices",
    "Shops & Retail",
    "Commercial/Inst. Land",
    "Agricultural/Farm Land",
    "Industrial Land/Plots",
    "Warehouse",
    "Cold Storage",
    "Factory & Manufacturing",
    "Hotel/Resorts",
    "Industrial Shed",
    "RCC Shed",
    "Godown",
];

const FURNISHING_OPTIONS = [
    { label: "Furnished", value: "furnished" },
    { label: "Semi-Furnished", value: "semi_furnished" },
    { label: "Unfurnished", value: "unfurnished" },
];

const ALLOWED_STATES = ["Telangana", "Karnataka", "Maharashtra"];

const STATUS_OPTIONS = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Sold", value: "sold" },
    { label: "Rented", value: "rented" },
];

/* ── Types ────────────────────────────────────────────────────── */

interface EditListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: AdminProperty | null;
    onSaveSuccess?: () => void;
}

type FormField = {
    label: string;
    key: string;
    type: "text" | "number" | "textarea" | "select";
    required?: boolean;
    options?: { label: string; value: string }[];
    placeholder?: string;
    half?: boolean;
};

/* ── Notification Toast ───────────────────────────────────────── */

function Toast({
    type,
    message,
    onClose,
}: {
    type: "success" | "error";
    message: string;
    onClose: () => void;
}) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-medium",
                "animate-in slide-in-from-bottom-4 fade-in duration-300",
                type === "success"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
            )}
        >
            {type === "success" ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

/* ── Form Field Component ─────────────────────────────────────── */

function FormInput({
    field,
    value,
    onChange,
    error,
}: {
    field: FormField;
    value: string | number;
    onChange: (val: string) => void;
    error?: string;
}) {
    const baseInputClass = cn(
        "w-full px-3.5 py-2.5 border rounded-xl text-sm text-text-primary",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "transition-all duration-200 bg-white",
        error
            ? "border-red-300 focus:ring-red-200 focus:border-red-400"
            : "border-border hover:border-slate-300"
    );

    return (
        <div className={cn("space-y-1.5", field.half ? "col-span-1" : "col-span-2")}>
            <label className="text-sm font-semibold text-text-secondary flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "textarea" ? (
                <textarea
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    rows={3}
                    placeholder={field.placeholder}
                    className={cn(baseInputClass, "resize-y min-h-[80px]")}
                />
            ) : field.type === "select" ? (
                <select
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(baseInputClass, "cursor-pointer")}
                >
                    <option value="">Select…</option>
                    {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={field.type}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    className={baseInputClass}
                />
            )}
            {error && (
                <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
            )}
        </div>
    );
}

/* ── Searchable Locality Input ────────────────────────────────── */

function LocalitySearchInput({
    value,
    cityName,
    onChange,
    onSelectLocality,
    error,
}: {
    value: string;
    cityName: string;
    onChange: (val: string) => void;
    onSelectLocality: (loc: Locality) => void;
    error?: string;
}) {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<Locality[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searching, setSearching] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    // Sync external value changes
    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.trim().length < 2) {
            setResults([]);
            return;
        }

        setSearching(true);
        const supabase = createClient();

        // Search localities by name or pincode, filtered by city name if available
        let query = supabase
            .from("localities")
            .select("id, city_id, name, pincode, latitude, longitude")
            .or(`name.ilike.%${searchQuery}%,pincode.ilike.%${searchQuery}%`)
            .limit(10);

        const { data } = await query;
        setResults((data as Locality[]) ?? []);
        setSearching(false);
    }, []);

    const handleInputChange = (val: string) => {
        setQuery(val);
        onChange(val);
        setIsOpen(true);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => handleSearch(val), 300);
    };

    const handleSelect = (loc: Locality) => {
        setQuery(loc.name);
        onChange(loc.name);
        onSelectLocality(loc);
        setIsOpen(false);
    };

    const baseInputClass = cn(
        "w-full px-3.5 py-2.5 border rounded-xl text-sm text-text-primary",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "transition-all duration-200 bg-white",
        error
            ? "border-red-300 focus:ring-red-200 focus:border-red-400"
            : "border-border hover:border-slate-300"
    );

    return (
        <div className="col-span-1 space-y-1.5" ref={wrapperRef}>
            <label className="text-sm font-semibold text-text-secondary flex items-center gap-1">
                Locality
                <Search className="w-3 h-3 text-text-muted" />
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => { if (query.length >= 2) setIsOpen(true); }}
                    placeholder="Search locality or pincode…"
                    className={baseInputClass}
                />
                {searching && (
                    <Loader2 className="w-4 h-4 animate-spin text-primary absolute right-3 top-1/2 -translate-y-1/2" />
                )}

                {isOpen && results.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {results.map((loc) => (
                            <button
                                key={loc.id}
                                type="button"
                                onClick={() => handleSelect(loc)}
                                className="w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors flex justify-between items-center text-sm border-b border-slate-50 last:border-0"
                            >
                                <span className="font-medium text-text-primary">{loc.name}</span>
                                <span className="text-xs text-text-muted font-mono">{loc.pincode}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
        </div>
    );
}

/* ── Main Modal ───────────────────────────────────────────────── */

export function EditListingModal({
    isOpen,
    onClose,
    property,
    onSaveSuccess,
}: EditListingModalProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Record<string, string | number | null>>({});
    const [originalData, setOriginalData] = useState<Record<string, string | number | null>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Fetch full property data on open
    useEffect(() => {
        if (!isOpen || !property) return;

        let isMounted = true;
        setLoading(true);
        setErrors({});

        fetchPropertyForAdminEdit(property.id).then(({ data, error }) => {
            if (!isMounted) return;
            if (error || !data) {
                setToast({ type: "error", message: error || "Failed to load property details" });
                setLoading(false);
                return;
            }

            const flat = flattenPropertyData(data);
            setFormData({ ...flat });
            setOriginalData({ ...flat });
            setLoading(false);
        });

        return () => {
            isMounted = false;
        };
    }, [isOpen, property]);

    const flattenPropertyData = useCallback((data: AdminPropertyEditData): Record<string, string | number | null> => {
        return {
            title: data.title,
            description: data.description ?? "",
            listing_type: data.listing_type,
            property_type: data.property_type,
            commercial_type: data.commercial_type ?? "",
            price: data.price,
            area_sqft: data.area_sqft,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            furnishing: data.furnishing ?? "",
            facing: data.facing ?? "",
            floor: data.floor,
            total_floors: data.total_floors,
            possession_status: data.possession_status ?? "",
            address: data.address,
            locality: data.locality ?? "",
            city: data.city,
            state: data.state ?? "",
            pincode: data.pincode ?? "",
            rera_number: data.rera_number ?? "",
            contact_number: data.contact_number ?? "",
            whatsapp_number: data.whatsapp_number ?? "",
            amenities: (data.amenities ?? []).join(", "),
            status: data.status,
            landmark: data.landmark ?? "",
        };
    }, []);

    const handleFieldChange = useCallback((key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [key]: ["price", "area_sqft", "bedrooms", "bathrooms", "floor", "total_floors"].includes(key)
                ? value === "" ? null : Number(value)
                : value,
        }));
        // Clear error for this field
        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
    }, []);

    const validate = useCallback((): boolean => {
        const errs: Record<string, string> = {};

        if (!formData.title || String(formData.title).trim().length === 0) {
            errs.title = "Title is required";
        }
        if (!formData.price || Number(formData.price) <= 0) {
            errs.price = "Price must be a positive number";
        }
        if (!formData.city || String(formData.city).trim().length === 0) {
            errs.city = "City is required";
        }
        if (!formData.area_sqft || Number(formData.area_sqft) <= 0) {
            errs.area_sqft = "Area must be a positive number";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    }, [formData]);

    const handleSave = useCallback(async () => {
        if (!property) return;
        if (!validate()) return;

        setSaving(true);

        // Build diff: only send changed fields
        const updates: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(formData)) {
            if (key === "amenities") {
                // Convert comma string back to array
                const newArr = String(val ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                const origArr = String(originalData.amenities ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                if (JSON.stringify(newArr) !== JSON.stringify(origArr)) {
                    updates.amenities = newArr;
                }
                continue;
            }
            if (val !== originalData[key]) {
                // Convert empty strings to null for nullable fields
                if (val === "" || val === null) {
                    updates[key] = null;
                } else {
                    updates[key] = val;
                }
            }
        }

        if (Object.keys(updates).length === 0) {
            setToast({ type: "success", message: "No changes to save" });
            setSaving(false);
            return;
        }

        const { success, error } = await updateAdminProperty(property.id, updates);
        setSaving(false);

        if (success) {
            setToast({ type: "success", message: "Property updated successfully!" });
            setTimeout(() => {
                onSaveSuccess?.();
                onClose();
            }, 800);
        } else {
            setToast({ type: "error", message: error || "Failed to update property" });
        }
    }, [property, formData, originalData, validate, onSaveSuccess, onClose]);

    if (!isOpen || !property) return null;

    // Determine which subtypes to show
    const propertyType = String(formData.property_type ?? "");
    const isCommercial = propertyType === "commercial";
    const subtypeOptions = isCommercial
        ? COMMERCIAL_SUBTYPES.map((s) => ({ label: s, value: s }))
        : RESIDENTIAL_SUBTYPES.map((s) => ({ label: s, value: s }));

    /* ── Field definitions ─────────────────────────────────────── */

    const sections: { title: string; fields: FormField[] }[] = [
        {
            title: "Basic Information",
            fields: [
                { label: "Title", key: "title", type: "text", required: true, placeholder: "Property title" },
                { label: "Description", key: "description", type: "textarea", placeholder: "Property description…" },
                { label: "Listing Type", key: "listing_type", type: "select", required: true, options: LISTING_TYPES, half: true },
                { label: "Status", key: "status", type: "select", required: true, options: STATUS_OPTIONS, half: true },
                { label: "Property Type", key: "property_type", type: "select", required: true, options: PROPERTY_TYPES, half: true },
                { label: "Subtype", key: "commercial_type", type: "select", options: subtypeOptions, half: true },
            ],
        },
        {
            title: "Pricing & Area",
            fields: [
                { label: "Price (₹)", key: "price", type: "number", required: true, placeholder: "e.g. 5000000", half: true },
                { label: "Area (sq.ft)", key: "area_sqft", type: "number", required: true, placeholder: "e.g. 1200", half: true },
            ],
        },
        {
            title: "Property Details",
            fields: [
                { label: "Bedrooms", key: "bedrooms", type: "number", placeholder: "e.g. 3", half: true },
                { label: "Bathrooms", key: "bathrooms", type: "number", placeholder: "e.g. 2", half: true },
                { label: "Furnishing", key: "furnishing", type: "select", options: FURNISHING_OPTIONS, half: true },
                { label: "Facing", key: "facing", type: "text", placeholder: "e.g. East", half: true },
                { label: "Floor", key: "floor", type: "number", placeholder: "e.g. 4", half: true },
                { label: "Total Floors", key: "total_floors", type: "number", placeholder: "e.g. 12", half: true },
                { label: "Possession Status", key: "possession_status", type: "text", placeholder: "e.g. Ready to Move", half: true },
                { label: "RERA Number", key: "rera_number", type: "text", placeholder: "e.g. P02400003939", half: true },
            ],
        },
        {
            title: "Location",
            fields: [
                { label: "Address", key: "address", type: "text", placeholder: "Full address" },
                { label: "Locality", key: "locality", type: "text", placeholder: "Search locality…", half: true },
                { label: "City", key: "city", type: "text", required: true, placeholder: "e.g. Hyderabad", half: true },
                { label: "State", key: "state", type: "select", options: ALLOWED_STATES.map((s) => ({ label: s, value: s })), half: true },
                { label: "Pincode", key: "pincode", type: "text", placeholder: "e.g. 500032", half: true },
                { label: "Landmark", key: "landmark", type: "text", placeholder: "Nearby landmark" },
            ],
        },
        {
            title: "Contact & Amenities",
            fields: [
                { label: "Contact Number", key: "contact_number", type: "text", placeholder: "+91 XXXXX XXXXX", half: true },
                { label: "WhatsApp Number", key: "whatsapp_number", type: "text", placeholder: "+91 XXXXX XXXXX", half: true },
                { label: "Amenities", key: "amenities", type: "text", placeholder: "Gym, Pool, Parking (comma-separated)" },
            ],
        },
    ];

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 flex flex-col max-h-[92vh]">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                        <div className="flex flex-col gap-0.5">
                            <h2 className="text-xl font-bold text-slate-900">Edit Property</h2>
                            <span className="text-xs text-slate-400 font-medium">
                                ID: {property.id.slice(0, 8)}…
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-sm text-text-muted">Loading property details…</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {sections.map((section) => (
                                    <div key={section.title}>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                                            {section.title}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {section.fields.map((field) => {
                                                // Render searchable locality input instead of plain text
                                                if (field.key === "locality") {
                                                    return (
                                                        <LocalitySearchInput
                                                            key={field.key}
                                                            value={String(formData.locality ?? "")}
                                                            cityName={String(formData.city ?? "")}
                                                            onChange={(val) => handleFieldChange("locality", val)}
                                                            onSelectLocality={(loc) => {
                                                                handleFieldChange("locality", loc.name);
                                                                handleFieldChange("pincode", loc.pincode);
                                                            }}
                                                            error={errors.locality}
                                                        />
                                                    );
                                                }
                                                return (
                                                    <FormInput
                                                        key={field.key}
                                                        field={field}
                                                        value={formData[field.key] ?? ""}
                                                        onChange={(val) => handleFieldChange(field.key, val)}
                                                        error={errors[field.key]}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-5 border-t border-slate-100 bg-white shrink-0 flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="px-6 py-2.5 rounded-2xl bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || loading}
                            className={cn(
                                "px-6 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95",
                                "bg-primary text-white hover:bg-primary/90",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "flex items-center gap-2"
                            )}
                        >
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast notification */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}
