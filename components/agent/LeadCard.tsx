import {
  Phone,
  MessageCircle, // Using as WhatsApp icon replacement for standard lucide
  Building,
  Calendar,
  Globe, // For "Visit Booking" / "Source" generic
  Plus,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface AgentLead {
  id: string;
  name: string;
  phone: string;
  propertyTitle: string;
  source: "Call" | "WhatsApp" | "Visit Booking";
  dateReceived: string;
  status: "New" | "Contacted" | "Visited" | "Closed";
}

interface LeadCardProps {
  lead: AgentLead;
  onStatusChange?: (status: AgentLead["status"]) => void;
}

export function LeadCard({ lead, onStatusChange }: LeadCardProps) {
  // Determine badge variant based on status
  const statusVariant =
    lead.status === "New"
      ? "default" // Blue
      : lead.status === "Contacted"
        ? "warning" // Orange
        : lead.status === "Visited"
          ? "outline" // Gray
          : "success"; // Green

  return (
    <Card>
      <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Top: Info row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Details Block */}
          <div className="flex flex-col gap-2">
            {/* Name and Status row */}
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-text-primary">
                {lead.name}
              </h3>
              <Badge variant={statusVariant}>{lead.status}</Badge>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Phone className="w-4 h-4 shrink-0" />
              <span className="font-medium text-text-primary">
                +91 {lead.phone}
              </span>
            </div>

            {/* Property */}
            <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
              <Building className="w-4 h-4 shrink-0 text-primary/70" />
              <span className="line-clamp-1">{lead.propertyTitle}</span>
            </div>

            {/* Meta: Source & Date */}
            <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span>{lead.source}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{lead.dateReceived}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Actions block */}
        <div className="pt-4 border-t border-border/50">
          {/* Mobile: Stacked, Desktop: Inline right aligned */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 w-full">
            {/* Action Buttons Group */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Phone className="w-3.5 h-3.5" />}
                className="w-full sm:w-auto text-primary border-primary/20 hover:bg-primary/5"
                onClick={() => window.open(`tel:+91${lead.phone}`, "_self")}
              >
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<MessageCircle className="w-3.5 h-3.5" />}
                className="w-full sm:w-auto text-emerald-600 border-emerald-600/20 hover:bg-emerald-50"
                onClick={() =>
                  window.open(
                    `https://wa.me/91${lead.phone.replace(/\D/g, "")}`,
                    "_blank",
                  )
                }
              >
                WhatsApp
              </Button>
            </div>

            {/* Dropdown & Note Group */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-2">
              {/* Native select styled as button for 'Change Status' */}
              <div className="relative w-full sm:w-auto">
                <select
                  className="w-full sm:w-auto appearance-none bg-slate-50 border border-border rounded-xl h-8 px-3 pr-8 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  value={lead.status.toLowerCase()}
                  onChange={(e) => {
                    if (onStatusChange) {
                      const val = e.target.value;
                      const statusMap: Record<string, AgentLead["status"]> = {
                        new: "New",
                        contacted: "Contacted",
                        visited: "Visited",
                        closed: "Closed",
                      };
                      if (statusMap[val]) {
                        onStatusChange(statusMap[val]);
                      }
                    }
                  }}
                >
                  <option value="" disabled>
                    Change Status
                  </option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="visited">Visited</option>
                  <option value="closed">Closed</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="w-full sm:w-auto text-xs h-8"
              >
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
