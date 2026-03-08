"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatsOverview } from "@/components/builder/StatsOverview";
import { LeadFunnel } from "@/components/builder/LeadFunnel";
import { fetchBuilderStats, fetchLeadFunnelData } from "@/lib/supabase/builder-dashboard";
import type { BuilderStats, LeadFunnelData } from "@/types";

export default function BuilderDashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<BuilderStats | undefined>(undefined);
    const [funnel, setFunnel] = useState<LeadFunnelData | undefined>(undefined);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setIsLoading(true);
            const [fetchedStats, fetchedFunnel] = await Promise.all([
                fetchBuilderStats(),
                fetchLeadFunnelData(),
            ]);
            if (!cancelled) {
                setStats(fetchedStats);
                setFunnel(fetchedFunnel);
                setIsLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 pb-20 lg:pb-0">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Builder Dashboard</h1>
                    <p className="mt-1 text-sm text-text-secondary">Overview of your development portfolio, leads, and performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/builder/projects" className="w-full sm:w-auto">
                        <Button
                            variant="primary"
                            className="w-full"
                        >
                            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                            Manage Projects
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 lg:space-y-10">
                <StatsOverview isLoading={isLoading} stats={stats} />

                {/* Lead Pipeline Overview */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-text-primary">Pipeline Health</h2>
                        <Link href="/builder/leads" className="text-sm font-semibold text-primary hover:underline flex items-center">
                            View Pipeline <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <LeadFunnel isLoading={isLoading} funnelData={funnel} />
                </section>

                {/* Secondary Call to actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col items-start gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-blue-900">Push new inventory</h3>
                            <p className="text-sm text-blue-700/80 mt-1">Easily block out or adjust pricing for specific units across all active plans.</p>
                        </div>
                        <Link href="/builder/units">
                            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100 focus-visible:ring-blue-500">
                                Open Unit Inventory
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
