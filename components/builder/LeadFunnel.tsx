"use client";

import { Users, Phone, Eye, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { LeadFunnelData } from "@/types";

interface LeadFunnelProps {
  isLoading?: boolean;
  funnelData?: LeadFunnelData;
}

export function LeadFunnel({ isLoading, funnelData }: LeadFunnelProps) {
  const cards = [
    {
      label: "New Leads",
      count: funnelData?.new ?? 0,
      icon: <Users className="w-4 h-4" />,
      bg: "bg-blue-50/50",
      border: "border-blue-100 hover:border-blue-200",
      text: "text-blue-700",
      countColor: "text-blue-900",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Contacted",
      count: funnelData?.contacted ?? 0,
      icon: <Phone className="w-4 h-4" />,
      bg: "bg-yellow-50/50",
      border: "border-yellow-100 hover:border-yellow-200",
      text: "text-yellow-700",
      countColor: "text-yellow-900",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "Site Visits",
      count: funnelData?.visited ?? 0,
      icon: <Eye className="w-4 h-4" />,
      bg: "bg-purple-50/50",
      border: "border-purple-100 hover:border-purple-200",
      text: "text-purple-700",
      countColor: "text-purple-900",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Closed Deals",
      count: funnelData?.closed ?? 0,
      icon: <Zap className="w-4 h-4" />,
      bg: "bg-green-50/50",
      border: "border-green-100 hover:border-green-200",
      text: "text-green-700",
      countColor: "text-green-900",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <section aria-label="Lead funnel summary">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Lead Funnel
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-bg-card p-5 h-32 flex flex-col justify-between"
              >
                <Skeleton className="h-4 w-20" />
                <div className="flex items-end justify-between">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ))
          : cards.map((card) => (
              <div
                key={card.label}
                tabIndex={0}
                aria-label={`${card.label}: ${card.count}`}
                className={`${card.bg} rounded-2xl border ${card.border} p-5 flex flex-col justify-between h-32 hover:shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`}
              >
                <span className={`${card.text} font-medium text-sm`}>
                  {card.label}
                </span>
                <div className="flex items-end justify-between">
                  <span className={`text-3xl font-bold ${card.countColor}`}>
                    {card.count}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center`}
                    aria-hidden="true"
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}
