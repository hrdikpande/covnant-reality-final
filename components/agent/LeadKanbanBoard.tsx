import { Phone, MessageCircle, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import type { AgentLead } from "@/components/agent/LeadCard";

interface LeadKanbanBoardProps {
  leads: AgentLead[];
  onStatusChange?: (leadId: string, status: AgentLead["status"]) => void;
}

const COLUMNS = [
  {
    id: "New",
    label: "New Leads",
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    id: "Contacted",
    label: "Contacted",
    color: "bg-orange-50 text-orange-700 border-orange-100",
  },
  {
    id: "Visited",
    label: "Visited",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    id: "Closed",
    label: "Closed",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
];

export function LeadKanbanBoard({
  leads,
  onStatusChange,
}: LeadKanbanBoardProps) {
  return (
    <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 snap-x snap-mandatory pt-2 pb-4 hide-scrollbar">
      {COLUMNS.map((col) => {
        const columnLeads = leads.filter((l) => l.status === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col gap-3 min-w-[280px] w-[80vw] md:min-w-0 md:w-auto snap-center shrink-0"
          >
            {/* Column Header */}
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-xl border ${col.color}`}
            >
              <span className="font-semibold text-sm">{col.label}</span>
              <span className="text-xs font-bold bg-white/50 px-2 py-0.5 rounded-full">
                {columnLeads.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="flex flex-col gap-3 min-h-[150px] rounded-xl bg-slate-50/50 p-2 border border-dashed border-border/80 lg:overflow-y-auto lg:max-h-[500px]">
              {columnLeads.length === 0 ? (
                <div className="text-center py-6 text-xs text-text-secondary font-medium">
                  No leads
                </div>
              ) : (
                columnLeads.map((lead) => (
                  <MiniLeadCard
                    key={lead.id}
                    lead={lead}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniLeadCard({
  lead,
  onStatusChange,
}: {
  lead: AgentLead;
  onStatusChange?: (id: string, status: AgentLead["status"]) => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow border-border/60">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-text-primary text-sm mb-1">
            {lead.name}
          </h4>
          {onStatusChange && (
            <select
              className="appearance-none bg-slate-50 border border-border rounded h-6 px-1.5 pr-5 text-[10px] font-medium text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
              value={lead.status.toLowerCase()}
              onChange={(e) => {
                const val = e.target.value;
                const statusMap: Record<string, AgentLead["status"]> = {
                  new: "New",
                  contacted: "Contacted",
                  visited: "Visited",
                  closed: "Closed",
                };
                if (statusMap[val]) {
                  onStatusChange(lead.id, statusMap[val]);
                }
              }}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="visited">Visited</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-2">
          <Building className="w-3.5 h-3.5 shrink-0 text-primary/70" />
          <span className="line-clamp-1">{lead.propertyTitle}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <span className="text-xs font-medium text-text-primary">
            +91 {lead.phone.slice(0, 5)}...
          </span>
          <div className="flex gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
              <Phone className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
