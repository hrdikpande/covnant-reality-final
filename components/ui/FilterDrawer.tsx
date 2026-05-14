import { X } from 'lucide-react';
import { useEffect } from 'react';
import { FilterContent } from '@/components/ui/FilterContent';
import type { SearchFilters } from '@/types';

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: SearchFilters;
    onFilterChange: (partial: Partial<SearchFilters>) => void;
}

export function FilterDrawer({ isOpen, onClose, filters, onFilterChange }: FilterDrawerProps) {
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleReset = () => {
        onFilterChange({
            listing_type: undefined,
            property_type: undefined,
            subtypes: undefined,
            bedrooms: undefined,
            price_min: undefined,
            price_max: undefined,
            area_min: undefined,
            area_max: undefined,
            furnishing: undefined,
            possession: undefined,
            is_verified: undefined,
            extra_locations: undefined,
        });
    };

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer — full-screen on mobile, bottom sheet on tablets */}
            <div
                className={`fixed z-[100] bg-white transform transition-transform duration-300 ease-in-out flex flex-col
                    inset-0
                    md:inset-auto md:bottom-0 md:left-0 md:right-0 md:max-w-md md:mx-auto md:rounded-t-3xl md:max-h-[85vh]
                    ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                role="dialog"
                aria-modal="true"
                aria-label="Property filters"
            >
                {/* Header — always visible, safe-area aware */}
                <div
                    className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0 bg-white z-10 md:rounded-t-3xl"
                    style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
                >
                    <h2 className="text-lg font-bold text-text-primary">Filters</h2>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-text-secondary hover:text-text-primary transition-colors"
                        aria-label="Close filters"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content — takes remaining space between header and footer */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 min-h-0">
                    <FilterContent filters={filters} onFilterChange={onFilterChange} />
                </div>

                {/* Footer — always visible, safe-area aware */}
                <div
                    className="shrink-0 border-t border-border bg-white px-4 py-3"
                    style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
                >
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="flex-1 border border-border bg-white hover:bg-slate-50 text-text-secondary font-semibold py-3 rounded-xl transition-colors text-sm"
                        >
                            Reset All
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-[2] bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm text-sm"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

