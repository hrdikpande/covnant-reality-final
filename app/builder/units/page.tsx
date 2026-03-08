"use client";

import { useState, useEffect } from "react";
import { UnitInventory } from "@/components/builder/UnitInventory";
import { fetchAllBuilderUnits } from "@/lib/supabase/builder-dashboard";
import type { DbProjectUnit } from "@/types";

export default function UnitsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [units, setUnits] = useState<(DbProjectUnit & { project_name: string })[]>([]);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setIsLoading(true);
            const data = await fetchAllBuilderUnits();
            if (!cancelled) {
                setUnits(data);
                setIsLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 pb-20 lg:pb-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Unit Inventory</h1>
                <p className="mt-1 text-sm text-text-secondary">Track the real-time status and pricing of all units across projects</p>
            </div>

            <UnitInventory isLoading={isLoading} units={units} />
        </div>
    );
}
