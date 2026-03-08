"use client";

import { useState, useEffect } from "react";
import { AnalyticsSection } from "@/components/builder/AnalyticsSection";
import { fetchBuilderAnalytics } from "@/lib/supabase/builder-dashboard";
import type { BuilderAnalytics } from "@/types";

export default function AnalyticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [analytics, setAnalytics] = useState<BuilderAnalytics | undefined>(undefined);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setIsLoading(true);
            const data = await fetchBuilderAnalytics();
            if (!cancelled) {
                setAnalytics(data);
                setIsLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-20 lg:pb-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Performance Analytics</h1>
                <p className="mt-1 text-sm text-text-secondary">In-depth insights into your views and conversion rates</p>
            </div>

            <AnalyticsSection isLoading={isLoading} analytics={analytics} />
        </div>
    );
}
