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

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed bottom-0 left-0 right-0 w-full bg-white z-50 rounded-t-3xl shadow-xl transform transition-transform duration-300 ease-in-out md:max-w-md md:mx-auto md:bottom-4 md:rounded-b-3xl ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    } flex flex-col max-h-[90vh]`}
            >
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
                    <h2 className="text-lg font-bold text-text-primary">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-full hover:bg-bg-card text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-8">
                    <FilterContent filters={filters} onFilterChange={onFilterChange} />
                </div>

                {/* Footer - Fixed */}
                <div className="p-5 border-t border-border shrink-0 bg-white md:rounded-b-3xl">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
}
