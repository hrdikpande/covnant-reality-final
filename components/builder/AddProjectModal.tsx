"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createProject, updateProject, uploadProjectImage } from "@/lib/supabase/builder-dashboard";
import type { DbProject } from "@/types";
import Image from "next/image";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSaved: () => void;
  editProject?: DbProject | null;
}

export function AddProjectModal({
  isOpen,
  onClose,
  onProjectSaved,
  editProject,
}: AddProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [possessionStatus, setPossessionStatus] = useState("");
  const [reraNumber, setReraNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isEditing = !!editProject;

  // Pre-fill when editing
  useEffect(() => {
    if (isOpen && editProject) {
      // Using setTimeout to avoid synchronous setState inside effect warning
      const timer = setTimeout(() => {
        setName(editProject.name);
        setDescription(editProject.description ?? "");
        setCity(editProject.city);
        setPossessionStatus(editProject.possession_status ?? "");
        setReraNumber(editProject.rera_number ?? "");
        setImageFile(null);
        setImagePreview(editProject.image_url ?? null);
        setError(null);
      }, 0);
      return () => clearTimeout(timer);
    } else if (isOpen) {
      const timer = setTimeout(() => {
        setName("");
        setDescription("");
        setCity("");
        setPossessionStatus("");
        setReraNumber("");
        setImageFile(null);
        setImagePreview(null);
        setError(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, editProject]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);

      requestAnimationFrame(() => {
        const firstInput =
          modalRef.current?.querySelector<HTMLInputElement>("input");
        if (firstInput) firstInput.focus();
      });
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);

      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleSubmit = async () => {
    if (!name.trim() || !city.trim()) {
      setError("Project name and city are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      city: city.trim(),
      possession_status: possessionStatus || undefined,
      rera_number: reraNumber.trim() || undefined,
      image_url: undefined as string | undefined, // will set if not editing, or will keep existing
    };

    let result;
    if (isEditing && editProject) {
      // Handle Image upload for EDIT
      if (imageFile) {
        const uploadRes = await uploadProjectImage(imageFile, editProject.id);
        if (uploadRes.success && uploadRes.url) {
          payload.image_url = uploadRes.url;
        } else {
          setError("Failed to upload image. " + (uploadRes.error ?? ""));
          setIsSubmitting(false);
          return;
        }
      }

      result = await updateProject(editProject.id, payload);
    } else {
      // CREATE
      result = await createProject(payload);

      // Handle Image upload for CREATE (need project ID first)
      if (result.success && result.project && imageFile) {
        const uploadRes = await uploadProjectImage(imageFile, result.project.id);
        if (uploadRes.success && uploadRes.url) {
          // Update project with the new image url
          await updateProject(result.project.id, { image_url: uploadRes.url });
        }
      }
    }

    setIsSubmitting(false);

    if (result.success) {
      onProjectSaved();
      onClose();
    } else {
      setError(result.error ?? "Something went wrong");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-project-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-[520px] relative animate-in zoom-in-95 duration-200 slide-in-from-bottom-4 my-auto h-auto max-h-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <Card className="w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-5 py-5 sm:px-8 sm:py-6 border-b border-border shrink-0">
            <h2
              id="add-project-modal-title"
              className="text-xl font-bold text-text-primary pr-8"
            >
              {isEditing ? "Edit Project" : "Add New Project"}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {isEditing
                ? "Update your project details"
                : "Fill in the project details below"}
            </p>
          </div>

          <CardContent className="px-5 py-6 sm:px-8 sm:py-8 overflow-y-auto">
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <Input
                label="Project Name"
                type="text"
                placeholder="e.g. Godrej Infinity"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Description
                </label>
                <textarea
                  className="w-full min-h-[80px] px-4 py-3 bg-bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
                  placeholder="Brief description of the project"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Input
                label="City"
                type="text"
                placeholder="e.g. Pune"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Possession Status
                </label>
                <select
                  className="w-full h-12 px-4 bg-bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                  value={possessionStatus}
                  onChange={(e) => setPossessionStatus(e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="under_construction">Under Construction</option>
                  <option value="ready_to_move">Ready to Move</option>
                  <option value="new_launch">New Launch</option>
                </select>
              </div>

              <Input
                label="RERA Registration Number"
                type="text"
                placeholder="e.g. P52100000001"
                value={reraNumber}
                onChange={(e) => setReraNumber(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Project Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-border">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                    />
                    <p className="text-xs text-text-muted mt-2">
                      Max size: 5MB. Recommended ratio: 16:9
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 border border-red-100">
                  {error}
                </p>
              )}
            </form>
          </CardContent>

          <div className="px-5 py-4 sm:px-8 sm:py-5 border-t border-border mt-auto bg-slate-50 shrink-0 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              className="min-w-[140px]"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? "Saving…" : "Creating…"}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
