'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SearchFilters } from '@/types';

// ─── Constants ──────────────────────────────────────────────────────────────

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

const BHK_OPTIONS = ["1", "2", "3", "4+"];

const FURNISHING_OPTIONS = [
    { label: "Furnished", value: "furnished" },
    { label: "Semi-Furnished", value: "semi_furnished" },
    { label: "Unfurnished", value: "unfurnished" },
];

const POSSESSION_OPTIONS = [
    { label: "Ready to Move", value: "ready" },
    { label: "Under Construction", value: "under_construction" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(s: string): string {
    return s.toLowerCase().replace(/[/&,\s]+/g, "-");
}

/** Check if a display-name subtype is in the current slugified subtypes array */
function isSubtypeSelected(displayName: string, subtypes: string[]): boolean {
    const slug = slugify(displayName);
    return subtypes.some((s) => s.toLowerCase() === slug);
}

/** Determine which filter sections to show based on current filters */
function detectContext(filters: SearchFilters): {
    showResidential: boolean;
    showCommercial: boolean;
} {
    const subtypes = filters.subtypes ?? [];
    const propType = filters.property_type?.toLowerCase();

    if (subtypes.length === 0) {
        // No subtypes selected — infer from property_type
        if (propType === "residential") return { showResidential: true, showCommercial: false };
        if (propType === "commercial") return { showResidential: false, showCommercial: true };
        // Neither → show both
        return { showResidential: true, showCommercial: true };
    }

    // Check if any subtype belongs to residential or commercial
    const resSlugs = new Set(RESIDENTIAL_SUBTYPES.map(slugify));
    const comSlugs = new Set(COMMERCIAL_SUBTYPES.map(slugify));

    let hasRes = false;
    let hasCom = false;
    for (const sub of subtypes) {
        const s = sub.toLowerCase();
        if (resSlugs.has(s)) hasRes = true;
        if (comSlugs.has(s)) hasCom = true;
    }

    // If still can't determine, fall back to property_type
    if (!hasRes && !hasCom) {
        if (propType === "residential") hasRes = true;
        else if (propType === "commercial") hasCom = true;
        else {
            hasRes = true;
            hasCom = true;
        }
    }

    return { showResidential: hasRes, showCommercial: hasCom };
}

// ─── Sub-components ─────────────────────────────────────────────────────────

interface FilterContentProps {
    filters: SearchFilters;
    onFilterChange: (partial: Partial<SearchFilters>) => void;
}

// ── Section wrapper
function FilterSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-3">
                {title}
            </h3>
            {children}
        </section>
    );
}

// ── Subtype Tile (Enhanced UI)
function SubtypeTile({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                onChange();
            }}
            className={`flex items-center justify-center px-3 py-2.5 rounded-xl border text-[11px] sm:text-xs font-semibold transition-all text-center min-h-[44px] ${
                checked
                    ? 'bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary/20'
                    : 'bg-white border-border text-text-secondary hover:border-primary/30 hover:bg-slate-50/50'
            }`}
        >
            {label}
        </button>
    );
}

// ── Chip button
function ChipButton({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                active
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'bg-white border-border text-text-secondary hover:border-text-secondary/30'
            }`}
        >
            {label}
        </button>
    );
}

// ── Number range input pair
function RangeInputs({
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
    minPlaceholder,
    maxPlaceholder,
    prefix,
}: {
    minValue?: number;
    maxValue?: number;
    onMinChange: (v: number | undefined) => void;
    onMaxChange: (v: number | undefined) => void;
    minPlaceholder: string;
    maxPlaceholder: string;
    prefix?: string;
}) {
    const debounceMin = useRef<ReturnType<typeof setTimeout> | null>(null);
    const debounceMax = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMin = (raw: string) => {
        if (debounceMin.current) clearTimeout(debounceMin.current);
        debounceMin.current = setTimeout(() => {
            const n = parseInt(raw, 10);
            onMinChange(isNaN(n) || n <= 0 ? undefined : n);
        }, 600);
    };

    const handleMax = (raw: string) => {
        if (debounceMax.current) clearTimeout(debounceMax.current);
        debounceMax.current = setTimeout(() => {
            const n = parseInt(raw, 10);
            onMaxChange(isNaN(n) || n <= 0 ? undefined : n);
        }, 600);
    };

    return (
        <div className="flex gap-2">
            <div className="flex-1 relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-medium">
                        {prefix}
                    </span>
                )}
                <input
                    type="number"
                    defaultValue={minValue ?? ''}
                    placeholder={minPlaceholder}
                    onChange={(e) => handleMin(e.target.value)}
                    className={`w-full h-10 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        prefix ? 'pl-7 pr-3' : 'px-3'
                    }`}
                />
            </div>
            <span className="flex items-center text-text-muted text-xs font-medium">
                to
            </span>
            <div className="flex-1 relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-medium">
                        {prefix}
                    </span>
                )}
                <input
                    type="number"
                    defaultValue={maxValue ?? ''}
                    placeholder={maxPlaceholder}
                    onChange={(e) => handleMax(e.target.value)}
                    className={`w-full h-10 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        prefix ? 'pl-7 pr-3' : 'px-3'
                    }`}
                />
            </div>
        </div>
    );
}

// ─── Main FilterContent ─────────────────────────────────────────────────────

export function FilterContent({ filters, onFilterChange }: FilterContentProps) {
    const subtypes = filters.subtypes ?? [];
    const { showResidential, showCommercial } = detectContext(filters);

    // Toggle a subtype in/out of the subtypes array
    const toggleSubtype = useCallback(
        (displayName: string) => {
            const slug = slugify(displayName);
            const current = [...(filters.subtypes ?? [])];
            const idx = current.findIndex((s) => s.toLowerCase() === slug);
            if (idx >= 0) {
                current.splice(idx, 1);
            } else {
                current.push(slug);
            }
            onFilterChange({ subtypes: current.length > 0 ? current : undefined });
        },
        [filters.subtypes, onFilterChange]
    );


    return (
        <div className="flex flex-col gap-6">
            {/* ── Listing Type ─────────────────────────────────────── */}
            <FilterSection title="Listing Type">
                <div className="flex flex-wrap gap-2">
                    {[
                        { label: 'Buy', value: 'sell' },
                        { label: 'Rent', value: 'rent' },
                    ].map((item) => (
                        <ChipButton
                            key={item.value}
                            label={item.label}
                            active={filters.listing_type === item.value}
                            onClick={() =>
                                onFilterChange({
                                    listing_type:
                                        filters.listing_type === item.value
                                            ? undefined
                                            : item.value,
                                })
                            }
                        />
                    ))}
                </div>
            </FilterSection>

            <hr className="border-t border-border" />

            {/* ── Residential Filters ──────────────────────────────── */}
            {showResidential && (
                <>
                    <FilterSection
                        title={
                            showCommercial
                                ? 'Residential Filters'
                                : 'Property Subtype'
                        }
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {RESIDENTIAL_SUBTYPES.map((name) => (
                                <SubtypeTile
                                    key={name}
                                    label={name}
                                    checked={isSubtypeSelected(name, subtypes)}
                                    onChange={() => toggleSubtype(name)}
                                />
                            ))}
                        </div>
                    </FilterSection>

                    <hr className="border-t border-border" />

                    {/* BHK */}
                    <FilterSection title="BHK">
                        <div className="flex flex-wrap gap-2">
                            {BHK_OPTIONS.map((val) => {
                                const numVal =
                                    val === '4+' ? 4 : parseInt(val, 10);
                                return (
                                    <ChipButton
                                        key={val}
                                        label={`${val} BHK`}
                                        active={filters.bedrooms === numVal}
                                        onClick={() =>
                                            onFilterChange({
                                                bedrooms:
                                                    filters.bedrooms === numVal
                                                        ? undefined
                                                        : numVal,
                                            })
                                        }
                                    />
                                );
                            })}
                        </div>
                    </FilterSection>

                    <hr className="border-t border-border" />

                    {/* Budget */}
                    <FilterSection title="Budget (₹)">
                        <RangeInputs
                            minValue={filters.price_min}
                            maxValue={filters.price_max}
                            onMinChange={(v) =>
                                onFilterChange({ price_min: v })
                            }
                            onMaxChange={(v) =>
                                onFilterChange({ price_max: v })
                            }
                            minPlaceholder="Min"
                            maxPlaceholder="Max"
                            prefix="₹"
                        />
                    </FilterSection>

                    <hr className="border-t border-border" />

                    {/* Area */}
                    <FilterSection title="Area (sq.ft)">
                        <RangeInputs
                            minValue={filters.area_min}
                            maxValue={filters.area_max}
                            onMinChange={(v) =>
                                onFilterChange({ area_min: v })
                            }
                            onMaxChange={(v) =>
                                onFilterChange({ area_max: v })
                            }
                            minPlaceholder="Min"
                            maxPlaceholder="Max"
                        />
                    </FilterSection>

                    <hr className="border-t border-border" />

                    {/* Furnishing */}
                    <FilterSection title="Furnishing">
                        <div className="flex flex-wrap gap-2">
                            {FURNISHING_OPTIONS.map((opt) => (
                                <ChipButton
                                    key={opt.value}
                                    label={opt.label}
                                    active={filters.furnishing === opt.value}
                                    onClick={() =>
                                        onFilterChange({
                                            furnishing:
                                                filters.furnishing === opt.value
                                                    ? undefined
                                                    : opt.value,
                                        })
                                    }
                                />
                            ))}
                        </div>
                    </FilterSection>

                    <hr className="border-t border-border" />

                    {/* Possession */}
                    <FilterSection title="Possession Status">
                        <div className="flex flex-wrap gap-2">
                            {POSSESSION_OPTIONS.map((opt) => (
                                <ChipButton
                                    key={opt.value}
                                    label={opt.label}
                                    active={filters.possession === opt.value}
                                    onClick={() =>
                                        onFilterChange({
                                            possession:
                                                filters.possession === opt.value
                                                    ? undefined
                                                    : opt.value,
                                        })
                                    }
                                />
                            ))}
                        </div>
                    </FilterSection>

                    {showCommercial && (
                        <hr className="border-t-2 border-primary/20" />
                    )}
                </>
            )}

            {/* ── Commercial Filters ───────────────────────────────── */}
            {showCommercial && (
                <>
                    <FilterSection
                        title={
                            showResidential
                                ? 'Commercial Filters'
                                : 'Property Subtype'
                        }
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {COMMERCIAL_SUBTYPES.map((name) => (
                                <SubtypeTile
                                    key={name}
                                    label={name}
                                    checked={isSubtypeSelected(name, subtypes)}
                                    onChange={() => toggleSubtype(name)}
                                />
                            ))}
                        </div>
                    </FilterSection>

                    {/* Show budget/area only if NOT already shown in residential section */}
                    {!showResidential && (
                        <>
                            <hr className="border-t border-border" />

                            <FilterSection title="Budget (₹)">
                                <RangeInputs
                                    minValue={filters.price_min}
                                    maxValue={filters.price_max}
                                    onMinChange={(v) =>
                                        onFilterChange({ price_min: v })
                                    }
                                    onMaxChange={(v) =>
                                        onFilterChange({ price_max: v })
                                    }
                                    minPlaceholder="Min"
                                    maxPlaceholder="Max"
                                    prefix="₹"
                                />
                            </FilterSection>

                            <hr className="border-t border-border" />

                            <FilterSection title="Area (sq.ft)">
                                <RangeInputs
                                    minValue={filters.area_min}
                                    maxValue={filters.area_max}
                                    onMinChange={(v) =>
                                        onFilterChange({ area_min: v })
                                    }
                                    onMaxChange={(v) =>
                                        onFilterChange({ area_max: v })
                                    }
                                    minPlaceholder="Min"
                                    maxPlaceholder="Max"
                                />
                            </FilterSection>
                        </>
                    )}
                </>
            )}

            <hr className="border-t border-border" />

            {/* ── Verified Properties ──────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-0.5">
                            Verified Properties
                        </h3>
                        <p className="text-xs text-text-secondary">
                            Show only physically verified listings
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={filters.is_verified === true}
                            onChange={() =>
                                onFilterChange({
                                    is_verified: filters.is_verified
                                        ? undefined
                                        : true,
                                })
                            }
                        />
                        <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </section>

        </div>
    );
}
