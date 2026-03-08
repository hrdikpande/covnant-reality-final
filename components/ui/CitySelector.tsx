"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CITIES = [
    "Mumbai",
    "Bangalore",
    "Hyderabad"
];

interface CitySelectorProps {
    isOpen: boolean;
    selectedCity: string;
    onSelect: (city: string) => void;
    onClose: () => void;
}

export function CitySelector({
    isOpen,
    selectedCity,
    onSelect,
    onClose,
}: CitySelectorProps) {
    const [search, setSearch] = useState("");
    const [visible, setVisible] = useState(false);
    const [animating, setAnimating] = useState(false);

    // Handle open/close animation lifecycle
    useEffect(() => {
        if (isOpen) {
            // Mount first, then animate in on next frame
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimating(true));
            });
        } else {
            // Animate out, then unmount after transition
            setAnimating(false);
            const timer = setTimeout(() => {
                setVisible(false);
                setSearch("");
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSelect = useCallback(
        (city: string) => {
            onSelect(city);
            onClose();
        },
        [onSelect, onClose]
    );

    const filteredCities = CITIES.filter((city) =>
        city.toLowerCase().includes(search.toLowerCase())
    );

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/40 transition-opacity duration-300",
                    animating ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer / Modal */}
            <div
                className={cn(
                    "relative w-full max-w-[28rem] bg-white rounded-t-3xl md:rounded-2xl shadow-2xl",
                    "transition-all duration-300 ease-out flex flex-col",
                    "max-h-[85vh] md:max-h-[80vh]",
                    "safe-area-bottom md:pb-0",
                    animating
                        ? "translate-y-0 opacity-100 md:scale-100"
                        : "translate-y-full md:translate-y-4 md:opacity-0 md:scale-95"
                )}
            >
                {/* Mobile Handle bar */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2 md:hidden">
                    <div className="flex-1" />
                    <div className="w-12 h-1.5 rounded-full bg-slate-200" />
                    <div className="flex-1 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
                            aria-label="Close city selector"
                        >
                            <X className="h-4.5 w-4.5" />
                        </button>
                    </div>
                </div>

                {/* Desktop Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="hidden md:flex absolute right-4 top-4 items-center justify-center h-8 w-8 rounded-full hover:bg-slate-100 transition-colors text-slate-500 z-10"
                    aria-label="Close city selector"
                >
                    <X className="h-4.5 w-4.5" />
                </button>

                {/* Title */}
                <div className="px-5 pb-3 pt-2 md:pt-6">
                    <h2 className="text-xl font-semibold text-text-primary">
                        Select City
                    </h2>
                    <p className="text-sm text-text-muted mt-0.5">
                        Choose your preferred location
                    </p>
                </div>

                {/* Search */}
                <div className="px-5 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={cn(
                                "w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-xl",
                                "placeholder:text-slate-400",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
                                "transition-all duration-200"
                            )}
                            autoFocus
                        />
                    </div>
                </div>

                {/* City Grid */}
                <div className="flex-1 overflow-y-auto px-5 pb-6 overscroll-contain">
                    {filteredCities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <MapPin className="h-8 w-8 mb-3 opacity-20" />
                            <p className="text-sm font-medium">No cities found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2.5">
                            {filteredCities.map((city) => {
                                const isSelected = city === selectedCity;
                                return (
                                    <button
                                        key={city}
                                        type="button"
                                        onClick={() => handleSelect(city)}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl transition-all duration-200",
                                            "text-sm font-medium",
                                            isSelected
                                                ? "bg-primary/10 text-primary ring-1 ring-primary/30 shadow-sm"
                                                : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                                        )}
                                    >
                                        <MapPin
                                            className={cn(
                                                "h-5 w-5 transition-colors",
                                                isSelected
                                                    ? "text-primary"
                                                    : "text-slate-400"
                                            )}
                                        />
                                        <span className="truncate w-full text-center">
                                            {city}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
