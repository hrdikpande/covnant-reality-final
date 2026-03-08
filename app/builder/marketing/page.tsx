"use client";

import { Rocket, Sparkles } from "lucide-react";

export default function MarketingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-3xl border border-dashed border-border animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Rocket className="w-10 h-10 text-primary animate-bounce-slow" />
            </div>

            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-bold text-primary tracking-widest uppercase">Coming Soon</span>
                <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>

            <h1 className="text-3xl font-black text-text-primary mb-4 tracking-tight">
                Supercharge Your Marketing
            </h1>

            <p className="text-text-secondary max-w-md text-lg leading-relaxed">
                We&apos;re building powerful tools to help you boost project visibility,
                generate premium leads, and manage your brand&apos;s presence on Covnant Reality.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
                    <p className="font-bold text-text-primary flex items-center gap-2">
                        🚀 Featured Listings
                    </p>
                    <p className="text-sm text-text-secondary mt-1">Push your projects to the top of every search.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
                    <p className="font-bold text-text-primary flex items-center gap-2">
                        📊 Ad Analytics
                    </p>
                    <p className="text-sm text-text-secondary mt-1">Track conversions and ROI for every campaign.</p>
                </div>
            </div>
        </div>
    );
}
