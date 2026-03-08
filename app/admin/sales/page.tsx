"use client";

import { Briefcase } from "lucide-react";

export default function SalesCRMPage() {
    return (
        <div className="w-full flex-1 p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Sales CRM</h1>
                    <p className="text-sm text-text-muted mt-1">
                        Manage onboarding pipelines and track agent subscription sales.
                    </p>
                </div>
            </div>

            {/* Coming Soon Placeholder */}
            <div className="bg-white border border-border rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="p-4 bg-primary/10 rounded-2xl mb-6">
                    <Briefcase className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">
                    Sales CRM Coming Soon
                </h2>
                <p className="text-text-muted text-sm max-w-md leading-relaxed">
                    The Sales CRM module is currently under development. Once live, you
                    will be able to manage onboarding pipelines, track subscription
                    sales, and monitor agent commissions — all from this dashboard.
                </p>
            </div>
        </div>
    );
}
