"use client";

import { useState, useEffect, useCallback } from "react";
import { ListFilter, LayoutList, KanbanSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LeadCard, type AgentLead } from "@/components/agent/LeadCard";
import { LeadKanbanBoard } from "@/components/agent/LeadKanbanBoard";
import {
  fetchAgentLeads,
  updateLeadStatus as updateLeadStatusRpc,
  type AgentLeadRow,
} from "@/lib/supabase/agent-dashboard";

function mapToAgentLead(row: AgentLeadRow): AgentLead {
  const sourceMap: Record<string, "Call" | "WhatsApp" | "Visit Booking"> = {
    call: "Call",
    whatsapp: "WhatsApp",
    visit: "Visit Booking",
    chat: "WhatsApp",
  };
  const statusMap: Record<string, AgentLead["status"]> = {
    new: "New",
    contacted: "Contacted",
    visited: "Visited",
    closed: "Closed",
  };

  return {
    id: row.id,
    name: row.name ?? "Unknown",
    phone: row.phone ?? "",
    propertyTitle: row.property?.title ?? "Unknown Property",
    source: sourceMap[row.source] ?? "Visit Booking",
    dateReceived: new Date(row.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    status: statusMap[row.status] ?? "New",
  };
}

export function LeadManagementSection() {
  const [leads, setLeads] = useState<AgentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [statusFilter, setStatusFilter] = useState("all_status");

  useEffect(() => {
    let cancelled = false;
    fetchAgentLeads()
      .then((data) => {
        if (!cancelled) setLeads(data.map(mapToAgentLead));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load leads");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStatusChange = useCallback(
    async (leadId: string, newStatus: AgentLead["status"]) => {
      const statusMap: Record<string, string> = {
        New: "new",
        Contacted: "contacted",
        Visited: "visited",
        Closed: "closed",
      };
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
      );
      const result = await updateLeadStatusRpc(leadId, statusMap[newStatus]);
      if (!result.success) {
        // Revert on failure
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: l.status } : l)),
        );
      }
    },
    [],
  );

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter === "all_status") return true;
    return lead.status.toLowerCase() === statusFilter;
  });

  const tabs = [
    { id: "all", label: "All" },
    { id: "buyer", label: "Buyer" },
    { id: "tenant", label: "Tenant" },
  ];

  return (
    <section className="px-4 sm:px-0">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <h2 className="text-xl font-bold text-text-primary">Leads</h2>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "kanban"
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <KanbanSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls Area */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                                    whitespace-nowrap px-4 py-1.5 text-sm font-medium rounded-lg transition-all
                                    ${
                                      activeTab === tab.id
                                        ? "bg-white text-text-primary shadow-sm"
                                        : "text-text-secondary hover:text-text-primary hover:bg-slate-200/50"
                                    }
                                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <ListFilter className="w-4 h-4 text-text-secondary" />
            </div>
            <select
              className="w-full sm:w-auto appearance-none bg-white border border-border rounded-xl h-10 pl-9 pr-10 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all_status">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="visited">Visited</option>
              <option value="closed">Closed</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-border rounded-2xl">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <span className="text-sm text-text-secondary">Loading leads…</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 bg-red-50 border border-red-200 rounded-2xl text-center px-4">
          <h3 className="text-lg font-bold text-red-700 mb-1">
            Failed to load leads
          </h3>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}

      {/* Display Area */}
      {!loading && !error && (
        <>
          {viewMode === "list" ? (
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(lead.id, newStatus)
                    }
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-text-secondary border border-dashed border-border rounded-xl bg-slate-50 flex items-center justify-center">
                  No leads found matching your filters.
                </div>
              )}
            </div>
          ) : (
            <LeadKanbanBoard
              leads={filteredLeads}
              onStatusChange={(id, status) => handleStatusChange(id, status)}
            />
          )}
        </>
      )}
    </section>
  );
}
