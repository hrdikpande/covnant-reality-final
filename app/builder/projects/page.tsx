"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProjectsSection } from "@/components/builder/ProjectsSection";
import { AddProjectModal } from "@/components/builder/AddProjectModal";
import { ManageUnitsPanel } from "@/components/builder/ManageUnitsPanel";
import { ProjectLeadsPanel } from "@/components/builder/ProjectLeadsPanel";
import { fetchBuilderProjects } from "@/lib/supabase/builder-dashboard";
import type { DbProject } from "@/types";

export default function ProjectsPage() {
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isManageUnitsOpen, setIsManageUnitsOpen] = useState(false);
    const [isProjectLeadsOpen, setIsProjectLeadsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<DbProject | null>(null);
    const [editProject, setEditProject] = useState<DbProject | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<DbProject[]>([]);

    const loadProjects = useCallback(async (isCancelled?: () => boolean) => {
        setIsLoading(true);
        const data = await fetchBuilderProjects();
        if (isCancelled && isCancelled()) return;
        setProjects(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(() => {
            loadProjects(() => cancelled);
        }, 0);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [loadProjects]);

    const handleEditProject = (project: DbProject) => {
        setEditProject(project);
        setIsAddProjectModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 pb-20 lg:pb-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
                    <p className="mt-1 text-sm text-text-secondary">Manage your development portfolio and track progress</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditProject(null);
                        setIsAddProjectModalOpen(true);
                    }}
                    className="w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                    Add New Project
                </Button>
            </div>

            <ProjectsSection
                isLoading={isLoading}
                projects={projects}
                onAddProject={() => {
                    setEditProject(null);
                    setIsAddProjectModalOpen(true);
                }}
                onEditProject={handleEditProject}
                onManageUnits={(project: DbProject) => {
                    setSelectedProject(project);
                    setIsManageUnitsOpen(true);
                }}
                onViewLeads={(project: DbProject) => {
                    setSelectedProject(project);
                    setIsProjectLeadsOpen(true);
                }}
                onProjectsChanged={loadProjects}
            />

            {/* Modals & Panels */}
            <AddProjectModal
                isOpen={isAddProjectModalOpen}
                onClose={() => {
                    setIsAddProjectModalOpen(false);
                    setTimeout(() => setEditProject(null), 200);
                }}
                onProjectSaved={loadProjects}
                editProject={editProject}
            />

            <ManageUnitsPanel
                isOpen={isManageUnitsOpen}
                onClose={() => {
                    setIsManageUnitsOpen(false);
                    setTimeout(() => setSelectedProject(null), 200);
                }}
                projectId={selectedProject?.id}
                projectName={selectedProject?.name}
            />

            <ProjectLeadsPanel
                isOpen={isProjectLeadsOpen}
                onClose={() => {
                    setIsProjectLeadsOpen(false);
                    setTimeout(() => setSelectedProject(null), 200);
                }}
                projectId={selectedProject?.id}
                projectName={selectedProject?.name}
            />
        </div>
    );
}
