"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { X, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchBuilderSalesReps } from "@/lib/supabase/builder-dashboard";

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName?: string;
}

export function AssignLeadModal({
  isOpen,
  onClose,
  leadName = "Lead Name",
}: AssignLeadModalProps) {
  const [salesReps, setSalesReps] = useState<{ id: string, name: string }[]>([]);
  const [isLoadingReps, setIsLoadingReps] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      // Save previously focused element for restoration
      previousActiveElement.current = document.activeElement as HTMLElement;

      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);

      // Focus the modal for keyboard navigation
      requestAnimationFrame(() => {
        const firstInput =
          modalRef.current?.querySelector<HTMLSelectElement>("select");
        if (firstInput) firstInput.focus();
      });
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus on close
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    if (isOpen) {
      let cancelled = false;
      fetchBuilderSalesReps().then(reps => {
        if (!cancelled) {
          setSalesReps(reps);
          setIsLoadingReps(false);
        }
      });
      return () => {
        cancelled = true;
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleKeyDown);
      }
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-lead-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md relative animate-in zoom-in-95 duration-200 slide-in-from-bottom-4 my-auto h-auto max-h-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary transition-colors"
          aria-label="Close assign lead dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <Card className="w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-5 py-5 sm:px-6 sm:py-6 border-b border-border shrink-0">
            <div className="flex items-center gap-3 pr-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2
                  id="assign-lead-modal-title"
                  className="text-xl font-bold text-text-primary"
                >
                  Assign Lead
                </h2>
                <p className="text-sm text-text-secondary mt-0.5">{leadName}</p>
              </div>
            </div>
          </div>

          <CardContent className="px-5 py-6 sm:px-6 sm:py-6 overflow-y-auto">
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">
                  Select Sales Representative{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full h-12 px-4 bg-bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    {isLoadingReps ? "Loading representatives..." : "Choose a representative..."}
                  </option>
                  {!isLoadingReps && salesReps.map((rep) => (
                    <option key={rep.id} value={rep.id}>
                      {rep.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary flex justify-between">
                  <span>Notes</span>
                  <span className="text-text-muted font-normal text-xs">
                    Optional
                  </span>
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[120px] placeholder:text-text-muted"
                  placeholder="Add any specific instructions or context for the sales rep..."
                />
              </div>
            </form>
          </CardContent>

          <div className="px-5 py-4 sm:px-6 sm:py-5 border-t border-border mt-auto bg-slate-50 shrink-0 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={onClose}>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Lead
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
