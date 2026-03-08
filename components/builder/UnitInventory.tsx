"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { DbProjectUnit, UnitStatus } from "@/types";

interface UnitInventoryProps {
  isLoading?: boolean;
  units: (DbProjectUnit & { project_name: string })[];
}

const statusVariant: Record<UnitStatus, "success" | "danger" | "warning"> = {
  available: "success",
  sold: "danger",
  blocked: "warning",
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

export function UnitInventory({ isLoading, units }: UnitInventoryProps) {
  if (isLoading) {
    return (
      <section aria-label="Unit inventory loading">
        <Skeleton className="h-7 w-48 mb-4" />
        <Card className="overflow-hidden p-0">
          <div className="hidden md:block">
            <div className="border-b border-border bg-slate-50 p-4">
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="p-4 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="md:hidden flex flex-col gap-px bg-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-bg-card p-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section aria-label="Unit inventory">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Unit Inventory
      </h2>
      <Card className="overflow-hidden">
        {units.length === 0 ? (
          <div className="p-8 text-center bg-slate-50">
            <p className="text-sm text-text-secondary">
              No units available in inventory. Add units from the Projects page.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-border">
                    <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {units.map((unit) => (
                    <tr
                      key={unit.id}
                      className="hover:bg-slate-50/50 transition-colors duration-150"
                    >
                      <td className="px-5 py-4">
                        <span className="font-medium text-text-primary text-sm">
                          {unit.unit_number}
                        </span>
                        {unit.bedrooms != null && (
                          <span className="text-xs text-text-muted ml-2">
                            {unit.bedrooms} BHK
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-text-secondary text-sm">
                        {unit.project_name}
                      </td>
                      <td className="px-5 py-4 text-text-secondary text-sm">
                        {unit.area_sqft.toLocaleString("en-IN")} sq.ft.
                      </td>
                      <td className="px-5 py-4 text-text-secondary text-sm">
                        {formatPrice(unit.price)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={statusVariant[unit.status]}>
                          {statusLabel[unit.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/tablet stacked cards */}
            <div className="flex flex-col gap-px bg-border md:hidden">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  tabIndex={0}
                  className="bg-bg-card p-4 flex items-center justify-between gap-4 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary text-sm truncate">
                      {unit.unit_number}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {unit.project_name}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {unit.area_sqft.toLocaleString("en-IN")} sq.ft. ·{" "}
                      {formatPrice(unit.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={statusVariant[unit.status]}>
                      {statusLabel[unit.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </section>
  );
}
