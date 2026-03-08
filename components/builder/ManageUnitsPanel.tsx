"use client";

import { useEffect, useCallback, useState } from "react";
import { X, Plus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { DbProjectUnit, UnitStatus } from "@/types";
import {
  fetchProjectUnits,
  createProjectUnit,
  updateProjectUnit,
  deleteProjectUnit,
} from "@/lib/supabase/builder-dashboard";

interface ManageUnitsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
}

const getStatusColor = (status: UnitStatus) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-700 border-green-200";
    case "sold":
      return "bg-red-100 text-red-700 border-red-200";
    case "blocked":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-slate-100 text-text-secondary border-border";
  }
};

const getStatusDot = (status: UnitStatus) => {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "sold":
      return "bg-red-500";
    case "blocked":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const statusLabel: Record<UnitStatus, string> = {
  available: "Available",
  sold: "Sold",
  blocked: "Blocked",
};

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export function ManageUnitsPanel({
  isOpen,
  onClose,
  projectId,
  projectName = "Project Name",
}: ManageUnitsPanelProps) {
  const [units, setUnits] = useState<DbProjectUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Add form state
  const [newUnitNumber, setNewUnitNumber] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newBedrooms, setNewBedrooms] = useState("");

  const loadUnits = async (pId: string) => {
    setIsLoading(true);
    const data = await fetchProjectUnits(pId);
    setUnits(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    if (isOpen && projectId) {
      const load = async () => {
        setIsLoading(true);
        const data = await fetchProjectUnits(projectId);
        if (!cancelled) {
          setUnits(data);
          setIsLoading(false);
        }
      };
      load();
    }
    return () => {
      cancelled = true;
    };
  }, [isOpen, projectId]);

  // Close on Escape key
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

  const handleAddUnit = async () => {
    if (!projectId || !newUnitNumber.trim() || !newPrice || !newArea) return;

    const priceNum = Number(newPrice);
    const areaNum = Number(newArea);

    if (isNaN(priceNum) || isNaN(areaNum)) {
      alert("Price and Area must be valid numbers");
      return;
    }

    setAddLoading(true);
    const result = await createProjectUnit({
      project_id: projectId,
      unit_number: newUnitNumber.trim(),
      price: priceNum,
      area_sqft: areaNum,
      bedrooms: newBedrooms ? Number(newBedrooms) : undefined,
    });
    setAddLoading(false);
    if (result.success) {
      setShowAddForm(false);
      setNewUnitNumber("");
      setNewPrice("");
      setNewArea("");
      setNewBedrooms("");
      loadUnits(projectId);
    } else {
      alert("Failed to create unit: " + result.error);
    }
  };

  const handleStatusChange = async (unitId: string, newStatus: UnitStatus) => {
    await updateProjectUnit(unitId, { status: newStatus });
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, status: newStatus } : u)),
    );
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm("Delete this unit?")) return;
    const result = await deleteProjectUnit(unitId);
    if (result.success) {
      setUnits((prev) => prev.filter((u) => u.id !== unitId));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-units-title"
    >
      <div
        className="w-full max-w-3xl h-full bg-slate-50 shadow-2xl animate-in slide-in-from-right-full duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-bg-card shrink-0">
          <div>
            <h2
              id="manage-units-title"
              className="text-xl font-bold text-text-primary"
            >
              Manage Units
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">
              All Units{" "}
              <span className="text-text-muted text-sm font-normal ml-1">
                ({units.length})
              </span>
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Unit
            </Button>
          </div>

          {/* Add Unit Form */}
          {showAddForm && (
            <div className="mb-6 p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
              <h4 className="text-sm font-semibold text-text-primary mb-3">
                New Unit
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Unit Number / Type"
                  type="text"
                  placeholder="e.g. 2BHK-A101"
                  value={newUnitNumber}
                  onChange={(e) => setNewUnitNumber(e.target.value)}
                />
                <Input
                  label="Price (₹)"
                  type="number"
                  placeholder="e.g. 9500000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
                <Input
                  label="Area (sqft)"
                  type="number"
                  placeholder="e.g. 1250"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                />
                <Input
                  label="Bedrooms"
                  type="number"
                  placeholder="e.g. 2"
                  value={newBedrooms}
                  onChange={(e) => setNewBedrooms(e.target.value)}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddUnit}
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  ) : null}
                  Save Unit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : units.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-text-secondary">No units added yet.</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add First Unit
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-hidden rounded-xl border border-border bg-bg-card shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border">
                      <th className="px-5 py-4 text-sm font-semibold text-text-secondary">
                        Unit
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold text-text-secondary">
                        Price
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold text-text-secondary">
                        Area
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold text-text-secondary">
                        Status
                      </th>
                      <th className="px-5 py-4 text-sm font-semibold text-text-secondary text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {units.map((unit) => (
                      <tr
                        key={unit.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <span className="font-medium text-text-primary">
                            {unit.unit_number}
                          </span>
                          {unit.bedrooms != null && (
                            <span className="text-xs text-text-muted ml-2">
                              {unit.bedrooms} BHK
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-text-secondary">
                          {formatPrice(unit.price)}
                        </td>
                        <td className="px-5 py-4 text-text-secondary">
                          {unit.area_sqft.toLocaleString("en-IN")} sq.ft.
                        </td>
                        <td className="px-5 py-4">
                          <div
                            className={cn(
                              "inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium",
                              getStatusColor(unit.status),
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full mr-1.5",
                                getStatusDot(unit.status),
                              )}
                            />
                            {statusLabel[unit.status]}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <select
                              className="h-8 pl-2 pr-6 text-sm bg-transparent border border-border outline-none focus:ring-1 focus:ring-primary rounded-md text-text-secondary cursor-pointer"
                              value={unit.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  unit.id,
                                  e.target.value as UnitStatus,
                                )
                              }
                            >
                              <option value="available">Available</option>
                              <option value="sold">Sold</option>
                              <option value="blocked">Blocked</option>
                            </select>
                            <button
                              className="text-text-muted hover:text-red-500 transition-colors p-1"
                              title="Delete Unit"
                              onClick={() => handleDeleteUnit(unit.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="flex flex-col gap-4 sm:hidden">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    tabIndex={0}
                    className="bg-bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col gap-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-text-primary">
                          {unit.unit_number}
                          {unit.bedrooms != null && (
                            <span className="text-xs text-text-muted ml-2">
                              {unit.bedrooms} BHK
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-text-muted mt-0.5">
                          {unit.area_sqft.toLocaleString("en-IN")} sq.ft. •{" "}
                          {formatPrice(unit.price)}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium",
                          getStatusColor(unit.status),
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full mr-1.5",
                            getStatusDot(unit.status),
                          )}
                        />
                        {statusLabel[unit.status]}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-1">
                      <select
                        className="h-9 px-3 text-sm bg-slate-50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg text-text-primary w-32"
                        value={unit.status}
                        onChange={(e) =>
                          handleStatusChange(
                            unit.id,
                            e.target.value as UnitStatus,
                          )
                        }
                      >
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="blocked">Blocked</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 border-border text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteUnit(unit.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
