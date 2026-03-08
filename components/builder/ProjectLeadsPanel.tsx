"use client";

import { useEffect, useCallback, useState } from "react";
import {
  X,
  Phone,
  UserPlus,
  Mail,
  Smartphone,
  Globe,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { AssignLeadModal } from "@/components/builder/AssignLeadModal";
import { fetchProjectLeads, type ProjectLead } from "@/lib/supabase/builder-dashboard";



interface ProjectLeadsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Contacted":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Site Visit":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Closed":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-text-secondary border-border";
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case "Website":
      return <Globe className="w-3.5 h-3.5 mr-1" />;
    case "WhatsApp":
      return <Smartphone className="w-3.5 h-3.5 mr-1" />;
    case "Call":
      return <PhoneCall className="w-3.5 h-3.5 mr-1" />;
    default:
      return null;
  }
};

export function ProjectLeadsPanel({
  isOpen,
  onClose,
  projectId,
  projectName = "Project Name",
}: ProjectLeadsPanelProps) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedLeadForAssign, setSelectedLeadForAssign] =
    useState<ProjectLead | null>(null);
  const [leads, setLeads] = useState<ProjectLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    let cancelled = false;
    if (isOpen && projectId) {
      fetchProjectLeads(projectId).then((data) => {
        if (!cancelled) {
          setLeads(data);
          setIsLoading(false);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-leads-title"
    >
      <div
        className="w-full max-w-lg h-full bg-slate-50 shadow-2xl animate-in slide-in-from-right-full duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-bg-card shrink-0">
          <div>
            <h2
              id="project-leads-title"
              className="text-xl font-bold text-text-primary"
            >
              Project Leads
            </h2>
            <p className="text-sm text-text-secondary mt-1">{projectName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">
            All Leads{" "}
            {!isLoading && (
              <span className="text-text-muted text-sm font-normal ml-2">
                ({leads.length})
              </span>
            )}
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-bg-card rounded-xl border border-border">
            <UserPlus className="w-12 h-12 text-primary/20 mb-3" />
            <h3 className="text-lg font-medium text-text-primary">No leads yet</h3>
            <p className="text-sm text-text-secondary max-w-sm mt-1">
              Leads for this project will appear here once interested buyers contact you.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                tabIndex={0}
                className="bg-bg-card rounded-xl border border-border p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-text-primary text-base">
                        {lead.name}
                      </h4>
                      <span className="text-xs text-text-muted hidden sm:inline-block">
                        • {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary mt-1">
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center hover:text-primary transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 mr-1.5" />
                        {lead.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-none"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium whitespace-nowrap",
                        getStatusColor(lead.status),
                      )}
                    >
                      {lead.status}
                    </div>
                    <span className="text-xs text-text-muted sm:hidden block">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-border bg-slate-50/50 -mx-4 px-4 sm:-mx-5 sm:px-5">
                  <div>
                    <span className="text-xs text-text-muted block mb-0.5">
                      Interested Unit
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {lead.property?.title || "Project Inquiry"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block mb-0.5">
                      Source
                    </span>
                    <span className="text-sm font-medium text-text-primary flex items-center">
                      {getSourceIcon(lead.source)}
                      {lead.source}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 hover:border-primary hover:text-primary transition-colors"
                    onClick={() => {
                      setSelectedLeadForAssign(lead);
                      setIsAssignModalOpen(true);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Assign
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white border-green-600"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals outside the sliding panel context but within the overlay wrapper */}
      <AssignLeadModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setTimeout(() => setSelectedLeadForAssign(null), 200);
        }}
        leadName={selectedLeadForAssign?.name ?? undefined}
      />
    </div>
  );
}
