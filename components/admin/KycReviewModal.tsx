"use client";

import { X, FileText, Check, ShieldAlert } from "lucide-react";
import { useEffect } from "react";

interface KycReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
}

export function KycReviewModal({ isOpen, onClose, userName = "User" }: KycReviewModalProps) {

    // Prevent body scroll when modal is open
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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-border bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                            Review KYC Documents
                        </h2>
                        <p className="text-sm text-text-muted mt-1">
                            Reviewing submission for <span className="font-semibold text-text-primary">{userName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-muted hover:text-text-primary hover:bg-slate-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-slate-50/30">
                    <div className="space-y-8">

                        {/* Important Warning / Guidelines Area (Optional but good UX) */}
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 flex gap-3">
                            <ShieldAlert className="w-5 h-5 shrink-0 text-blue-600" />
                            <p>Please verify that the details on the documents match the user profile. Ensure images are clear, unedited, and officially issued.</p>
                        </div>

                        {/* Document Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* PAN Card */}
                            <div className="flex flex-col gap-3">
                                <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    PAN Document
                                </h3>
                                <div className="aspect-[4/3] bg-slate-100 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted hover:bg-slate-50 transition-colors group cursor-pointer relative overflow-hidden">
                                    <FileText className="w-10 h-10 mb-3 text-slate-400 group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-medium">Click to view full image</span>
                                    <span className="text-xs mt-1">pan_card_front.jpg</span>

                                    {/* Mock image overlay on hover to simulate document */}
                                    <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/90 px-3 py-1.5 rounded-lg text-sm font-semibold text-primary shadow-sm backdrop-blur-sm">🔍 Preview</div>
                                    </div>
                                </div>
                            </div>

                            {/* Aadhaar */}
                            <div className="flex flex-col gap-3">
                                <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Aadhaar Card
                                </h3>
                                <div className="aspect-[4/3] bg-slate-100 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted hover:bg-slate-50 transition-colors group cursor-pointer relative overflow-hidden">
                                    <FileText className="w-10 h-10 mb-3 text-slate-400 group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-medium">Click to view full image</span>
                                    <span className="text-xs mt-1">aadhaar_scan.pdf</span>

                                    <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/90 px-3 py-1.5 rounded-lg text-sm font-semibold text-primary shadow-sm backdrop-blur-sm">🔍 Preview</div>
                                    </div>
                                </div>
                            </div>

                            {/* RERA Certificate */}
                            <div className="flex flex-col gap-3">
                                <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    RERA Certificate
                                </h3>
                                <div className="aspect-[4/3] bg-slate-100 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted hover:bg-slate-50 transition-colors group cursor-pointer relative overflow-hidden">
                                    <FileText className="w-10 h-10 mb-3 text-slate-400 group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-medium">Click to view full image</span>
                                    <span className="text-xs mt-1">rera_certificate_2024.pdf</span>

                                    <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/90 px-3 py-1.5 rounded-lg text-sm font-semibold text-primary shadow-sm backdrop-blur-sm">🔍 Preview</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 md:p-6 border-t border-border bg-white flex flex-col sm:flex-row items-center justify-end gap-3 mt-auto">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-border text-text-primary font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            console.log("Reject KYC");
                            onClose();
                        }}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Reject KYC
                    </button>
                    <button
                        onClick={() => {
                            console.log("Approve KYC");
                            onClose();
                        }}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-sm shadow-green-600/20 flex items-center justify-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Approve KYC
                    </button>
                </div>
            </div>
        </div>
    );
}
