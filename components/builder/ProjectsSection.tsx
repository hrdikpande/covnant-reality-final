"use client";

import { useState, useCallback } from "react";
import { Plus, Edit2, LayoutGrid, Eye, Building2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { FeaturedProjectCard } from "@/components/ui/FeaturedProjectCard";
import type { Project, DbProject } from "@/types";
import { deleteProject } from "@/lib/supabase/builder-dashboard";

interface ProjectsSectionProps {
  isLoading?: boolean;
  projects: DbProject[];
  onAddProject: () => void;
  onEditProject: (project: DbProject) => void;
  onManageUnits: (project: DbProject) => void;
  onViewLeads: (project: DbProject) => void;
  onProjectsChanged: () => void;
}

/** Maps a DbProject row to the UI Project shape needed by FeaturedProjectCard */
function toUiProject(p: DbProject): Project {
  return {
    id: p.id,
    name: p.name,
    builder: "Your Project",
    location: p.city,
    city: p.city,
    startingPrice: 0, // individual price is on units, not the project row
    possessionStatus: p.possession_status ?? "TBD",
    reraBadge: p.rera_number ?? "N/A",
    image: p.image_url ?? "/placeholder-project.jpg",
  };
}

export function ProjectsSection({
  isLoading,
  projects,
  onAddProject,
  onEditProject,
  onManageUnits,
  onViewLeads,
  onProjectsChanged,
}: ProjectsSectionProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = useCallback(
    async (project: DbProject) => {
      if (
        !confirm(
          `Delete "${project.name}"? This will also remove all its units.`,
        )
      )
        return;
      setDeletingId(project.id);
      const result = await deleteProject(project.id);
      setDeletingId(null);
      if (result.success) {
        onProjectsChanged();
      } else {
        alert(result.error ?? "Failed to delete project");
      }
    },
    [onProjectsChanged],
  );

  return (
    <section aria-label="Project management">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">My Projects</h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-bg-card rounded-2xl border border-border overflow-hidden"
            >
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-4 space-y-3 border-b border-border/50">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="p-4 bg-slate-50/50 flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-border rounded-2xl bg-slate-50 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Building2 className="w-8 h-8" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            No projects yet
          </h3>
          <p className="text-sm text-text-secondary max-w-sm mb-6">
            Get started by adding your first project to manage units, leads, and
            marketing.
          </p>
          <Button variant="primary" onClick={onAddProject}>
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            Add New Project
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              tabIndex={0}
              className="flex flex-col bg-bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <FeaturedProjectCard
                project={toUiProject(project)}
                className="border-0 shadow-none rounded-none rounded-t-2xl border-b border-border/50 group-hover:bg-slate-50/50 transition-colors"
              />
              <div className="p-4 bg-slate-50/50 flex flex-wrap gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[100px] bg-white text-xs sm:text-sm h-9 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus:outline-none"
                  onClick={() => onEditProject(project)}
                >
                  <Edit2
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5"
                    aria-hidden="true"
                  />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[100px] bg-white text-xs sm:text-sm h-9 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus:outline-none"
                  onClick={() => onManageUnits(project)}
                >
                  <LayoutGrid
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5"
                    aria-hidden="true"
                  />
                  Manage Units
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[100px] bg-white text-xs sm:text-sm h-9 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus:outline-none"
                  onClick={() => onViewLeads(project)}
                >
                  <Eye
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5"
                    aria-hidden="true"
                  />
                  View Leads
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1 min-w-[100px] text-xs sm:text-sm h-9 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:outline-none focus:outline-none"
                  disabled={deletingId === project.id}
                  onClick={() => handleDelete(project)}
                >
                  <Trash2
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5"
                    aria-hidden="true"
                  />
                  {deletingId === project.id ? "Deleting…" : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}


    </section>
  );
}
