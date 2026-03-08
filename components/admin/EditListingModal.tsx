import { X } from "lucide-react";
import { useEffect } from "react";
import type { AdminProperty } from "@/lib/supabase/admin";

interface EditListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: AdminProperty | null;
}

export function EditListingModal({ isOpen, onClose, property }: EditListingModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !property) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold text-text-primary">Edit Listing</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-text-muted hover:text-text-primary hover:bg-slate-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[calc(100vh-160px)] overflow-y-auto">
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label htmlFor="title" className="text-sm font-medium text-text-secondary">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                defaultValue={property.title}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="E.g. Skyline Apartments Unit 4B"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="price" className="text-sm font-medium text-text-secondary">
                                Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                defaultValue={property.price}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="E.g. 15000000"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="description" className="text-sm font-medium text-text-secondary">
                                Description
                            </label>
                            <textarea
                                id="description"
                                defaultValue={property.description || ""}
                                rows={4}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y"
                                placeholder="Provide property details..."
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-slate-50 flex items-center justify-end gap-3 sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-white border border-border hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
