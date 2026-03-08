"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BuildingIcon, User, CheckCircle, Clock, Loader2 } from "lucide-react";
import {
  fetchClosedDeals,
  type ClosedDealRow,
} from "@/lib/supabase/agent-dashboard";

interface CommissionRecord {
  id: string;
  property: string;
  client: string;
  dealValue: string;
  commissionPercent: number;
  commissionAmount: string;
  status: "Pending" | "Received";
}

export function CommissionTrackingSection() {
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchClosedDeals()
      .then((deals) => {
        if (cancelled) return;
        const records: CommissionRecord[] = deals.map((deal: ClosedDealRow) => {
          const commissionPct = 2;
          const commissionAmt = deal.deal_value * (commissionPct / 100);
          return {
            id: deal.id,
            property: deal.property_title,
            client: deal.client_name,
            dealValue:
              deal.deal_value > 0
                ? `₹${Number(deal.deal_value).toLocaleString("en-IN")}`
                : "—",
            commissionPercent: commissionPct,
            commissionAmount:
              commissionAmt > 0
                ? `₹${Number(commissionAmt).toLocaleString("en-IN")}`
                : "—",
            status: "Pending" as const,
          };
        });
        setCommissions(records);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="px-4 sm:px-0">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-text-primary">
            Commission Tracking
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Track your deals, revenue, and payment statuses.
          </p>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  if (commissions.length === 0) {
    return (
      <section className="px-4 sm:px-0">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-text-primary">
            Commission Tracking
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Track your deals, revenue, and payment statuses.
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-text-secondary">
              No closed deals yet. Commission data will appear here once leads
              are closed.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-0">
      {/* Header Area */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary">
          Commission Tracking
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Track your deals, revenue, and payment statuses.
        </p>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border/50">
                  <th className="py-4 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Property
                  </th>
                  <th className="py-4 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Client
                  </th>
                  <th className="py-4 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                    Deal Value
                  </th>
                  <th className="py-4 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                    Commission %
                  </th>
                  <th className="py-4 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                    Commission Amount
                  </th>
                  <th className="py-4 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 bg-white">
                {commissions.map((comm) => (
                  <tr
                    key={comm.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <BuildingIcon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-text-primary text-sm line-clamp-1">
                          {comm.property}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        <span>{comm.client}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-sm font-medium text-text-primary text-right">
                      {comm.dealValue}
                    </td>
                    <td className="py-4 px-5 text-sm font-medium text-text-primary text-right">
                      {comm.commissionPercent}%
                    </td>
                    <td className="py-4 px-5 text-sm font-bold text-primary text-right">
                      {comm.commissionAmount}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <Badge
                        variant={
                          comm.status === "Received" ? "success" : "warning"
                        }
                      >
                        {comm.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card Layout */}
      <div className="flex flex-col gap-4 sm:hidden">
        {commissions.map((comm) => (
          <Card key={comm.id}>
            <CardContent className="p-4 flex flex-col gap-4">
              {/* Property & Status Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BuildingIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary text-sm line-clamp-2">
                      {comm.property}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{comm.client}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  {comm.status === "Received" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500" />
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border/50" />

              {/* Financial Details */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">
                    Deal Value
                  </span>
                  <span className="font-medium text-text-primary text-sm mt-0.5">
                    {comm.dealValue}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">
                    Commission %
                  </span>
                  <span className="font-medium text-text-primary text-sm mt-0.5">
                    {comm.commissionPercent}%
                  </span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-text-secondary">
                    Commission Amount
                  </span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-bold text-primary text-base">
                      {comm.commissionAmount}
                    </span>
                    <Badge
                      variant={
                        comm.status === "Received" ? "success" : "warning"
                      }
                    >
                      {comm.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
