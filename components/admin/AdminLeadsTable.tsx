"use client";

import { Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminLead } from "@/lib/supabase/admin";

interface AdminLeadsTableProps {
    leads: AdminLead[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "new":
            return "bg-blue-100 text-blue-700";
        case "contacted":
            return "bg-amber-100 text-amber-700";
        case "visited":
            return "bg-purple-100 text-purple-700";
        case "closed":
            return "bg-green-100 text-green-700";
        default:
            return "bg-slate-100 text-slate-700";
    }
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export function AdminLeadsTable({ leads }: AdminLeadsTableProps) {
    return (
        <div className="bg-white border border-border rounded-xl shadow-sm text-sm">
            {/* Mobile view */}
            <div className="lg:hidden divide-y divide-border">
                {leads.length > 0 ? (
                    leads.map((lead) => (
                        <div key={lead.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-semibold text-text-primary block">{lead.name ?? "Unknown"}</span>
                                    <span className="text-xs text-text-muted">{lead.phone ?? "N/A"}</span>
                                </div>
                                <span className={cn(
                                    "px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full capitalize",
                                    getStatusBadge(lead.status)
                                )}>
                                    {lead.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-y-2 text-xs">
                                <div>
                                    <span className="text-text-muted block mb-0.5">Property</span>
                                    <span className="font-medium text-text-primary block truncate">{lead.property_title ?? "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-text-muted block mb-0.5">Agent</span>
                                    <span className="font-medium text-text-primary block">{lead.agent_name ?? "Unassigned"}</span>
                                </div>
                                <div>
                                    <span className="text-text-muted block mb-0.5">Source</span>
                                    <span className="font-medium text-text-primary block capitalize">{lead.source}</span>
                                </div>
                                <div>
                                    <span className="text-text-muted block mb-0.5">Date</span>
                                    <span className="text-text-primary block">{formatDate(lead.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center text-text-muted">
                        No leads found.
                    </div>
                )}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-border">
                            <th className="px-6 py-4 font-semibold text-text-secondary">Lead Name</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">Phone</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">Property</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">City</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">Agent</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">Source</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">Date</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {leads.length > 0 ? (
                            leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-text-primary">{lead.name ?? "Unknown"}</span>
                                    </td>
                                    <td className="px-6 py-4 text-text-muted">
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5" />
                                            {lead.phone ?? "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-text-primary truncate max-w-[200px] block">{lead.property_title ?? "N/A"}</span>
                                    </td>
                                    <td className="px-6 py-4 text-text-muted">{lead.property_city ?? "—"}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-text-muted" />
                                            <span className="text-text-primary">{lead.agent_name ?? "Unassigned"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-md bg-slate-100 text-slate-600 capitalize">
                                            {lead.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-muted">{formatDate(lead.created_at)}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full capitalize",
                                            getStatusBadge(lead.status)
                                        )}>
                                            {lead.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-text-muted">
                                    No leads found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
