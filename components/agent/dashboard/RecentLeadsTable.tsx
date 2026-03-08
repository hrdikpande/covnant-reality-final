"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Phone, Eye } from "lucide-react";
import { getRecentAgentLeads, updateLeadStatus, type AgentLeadRow } from "@/lib/supabase/agent-dashboard";

export function RecentLeadsTable() {
    const [leads, setLeads] = useState<AgentLeadRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        getRecentAgentLeads()
            .then((data) => {
                if (!cancelled) setLeads(data);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleStatusChange = async (leadId: string, newStatus: string) => {
        setUpdating(leadId);
        const { success } = await updateLeadStatus(leadId, newStatus);
        if (success) {
            setLeads((prev) =>
                prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
            );
        }
        setUpdating(null);
    };

    const statusColors: Record<string, string> = {
        new: "bg-blue-50 text-blue-600",
        contacted: "bg-yellow-50 text-yellow-600",
        visited: "bg-purple-50 text-purple-600",
        closed: "bg-emerald-50 text-emerald-600",
        lost: "bg-red-50 text-red-600",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
        );
    }

    if (leads.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-text-secondary">No recent leads found.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border bg-slate-50/50">
                        <th className="p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Lead Info</th>
                        <th className="p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Property</th>
                        <th className="p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                        <th className="p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                        <th className="p-3 text-xs font-medium text-text-secondary uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {leads.map((lead) => {
                        const dateStr = new Date(lead.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                        });

                        return (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-3">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-text-primary">{lead.name || lead.buyer?.full_name || "Unknown"}</span>
                                        <span className="text-xs text-text-secondary">{lead.phone || "No phone"}</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <span className="text-sm text-text-secondary truncate max-w-[150px] inline-block">
                                        {lead.property?.title || "Unknown"}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <select
                                        value={lead.status?.toLowerCase() || "new"}
                                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                        disabled={updating === lead.id}
                                        className={`text-xs font-medium px-2.5 py-1 rounded-md border-0 cursor-pointer appearance-none outline-none ${statusColors[lead.status?.toLowerCase() || "new"] || "bg-slate-100 text-slate-700"
                                            } ${updating === lead.id ? 'opacity-50' : ''}`}
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="visited">Visited</option>
                                        <option value="closed">Closed</option>
                                        <option value="lost">Lost</option>
                                    </select>
                                </td>
                                <td className="p-3">
                                    <span className="text-sm text-text-secondary">{dateStr}</span>
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {lead.phone && (
                                            <a href={`tel:${lead.phone}`} className="p-1.5 text-text-secondary hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Call">
                                                <Phone className="w-4 h-4" />
                                            </a>
                                        )}
                                        <Link href="/agent/leads" className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="View">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
