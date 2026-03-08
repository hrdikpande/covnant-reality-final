import {
  Phone,
  UserPlus,
  Mail,
  Globe,
  Smartphone,
  PhoneCall,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

import { type ProjectLead } from "@/lib/supabase/builder-dashboard";

// Removed LeadData interface and mockLeads array.

const statusVariant: Record<
  string,
  "default" | "warning" | "outline" | "success"
> = {
  New: "default",
  Contacted: "warning",
  "Site Visit": "outline",
  Closed: "success",
};

const sourceIcons: Record<string, React.ReactNode> = {
  Website: <Globe className="w-3.5 h-3.5" aria-hidden="true" />,
  WhatsApp: <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />,
  Call: <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />,
};

export function LeadList({ isLoading, leads = [] }: { isLoading?: boolean; leads?: ProjectLead[] }) {
  if (isLoading) {
    return (
      <section aria-label="Lead list loading">
        <Card className="flex flex-col h-[500px] lg:h-full overflow-hidden p-0">
          <div className="p-4 sm:p-5 border-b border-border bg-slate-50 flex items-center justify-between shrink-0">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex border-b border-border/50 pb-4 last:border-0 last:pb-0"
                >
                  <Skeleton className="w-10 h-10 rounded-full mr-3 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2 pt-1 mt-2 border-t border-border/50">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section aria-label="Lead list">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">
          Recent Leads
          <span className="text-text-muted text-sm font-normal ml-2">
            ({leads.length})
          </span>
        </h2>
      </div>

      {/* Desktop table */}
      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Source
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/50 transition-colors duration-150"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-text-primary text-sm">
                      {lead.name || "Unknown"}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-text-secondary">{lead.phone || "N/A"}</p>
                    <p className="text-xs text-text-muted truncate max-w-[180px]">
                      {lead.email || "No email"}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {lead.property?.title || "General"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                      {sourceIcons[lead.source] || <Globe className="w-3.5 h-3.5" />}
                      {lead.source || "Website"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusVariant[lead.status] || "default"}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label={`Assign ${lead.name || "Lead"}`}
                      >
                        <UserPlus
                          className="w-3.5 h-3.5 mr-1.5"
                          aria-hidden="true"
                        />
                        Assign
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 border-green-600"
                        aria-label={`Call ${lead.name || "Lead"}`}
                      >
                        <Phone
                          className="w-3.5 h-3.5 mr-1.5"
                          aria-hidden="true"
                        />
                        Call
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile/tablet stacked cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {leads.map((lead) => (
          <Card key={lead.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  {lead.name || "Unknown"}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{new Date(lead.created_at).toLocaleDateString()}</p>
              </div>
              <Badge variant={statusVariant[lead.status] || "default"}>{lead.status}</Badge>
            </div>
            <div className="space-y-1.5 text-sm text-text-secondary mb-4">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {lead.phone || "N/A"}
              </p>
              <p className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{lead.email || "No email"}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-border text-xs mb-4">
              <div>
                <span className="text-text-muted block">Unit</span>
                <span className="font-medium text-text-primary">
                  {lead.property?.title || "General"}
                </span>
              </div>
              <div>
                <span className="text-text-muted block">Source</span>
                <span className="font-medium text-text-primary flex items-center gap-1">
                  {sourceIcons[lead.source] || <Globe className="w-3.5 h-3.5" />} {lead.source || "Website"}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                aria-label={`Assign ${lead.name || "Lead"}`}
              >
                <UserPlus className="w-4 h-4 mr-1.5" aria-hidden="true" />
                Assign
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 border-green-600"
                aria-label={`Call ${lead.name || "Lead"}`}
              >
                <Phone className="w-4 h-4 mr-1.5" aria-hidden="true" />
                Call
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
