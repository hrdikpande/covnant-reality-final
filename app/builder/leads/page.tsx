"use client";

import { useState, useEffect } from "react";
import { LeadFunnel } from "@/components/builder/LeadFunnel";
import { LeadList } from "@/components/builder/LeadList";
import { fetchAllBuilderLeads, type ProjectLead } from "@/lib/supabase/builder-dashboard";

export default function LeadsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [leads, setLeads] = useState<ProjectLead[]>([]);

    useEffect(() => {
        let isCancelled = false;
        fetchAllBuilderLeads().then((data) => {
            if (!isCancelled) {
                setLeads(data);
                setIsLoading(false);
            }
        });
        return () => { isCancelled = true; };
    }, []);

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-20 lg:pb-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Leads Management</h1>
                <p className="mt-1 text-sm text-text-secondary">View pipeline performance and manage incoming buyer inquiries</p>
            </div>

            <div className="flex flex-col gap-8">
                {/* Note: LeadFunnel might eventually take data but for now just pass isLoading */}
                <LeadFunnel isLoading={isLoading} />
                <LeadList isLoading={isLoading} leads={leads} />
            </div>
        </div>
    );
}
