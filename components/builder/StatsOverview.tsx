"use client";

import { Building2, Home, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { BuilderStats } from "@/types";

interface StatsOverviewProps {
  isLoading?: boolean;
  stats?: BuilderStats;
}

function formatPipelineValue(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  if (value > 0) return `₹${value.toLocaleString("en-IN")}`;
  return "₹0";
}

export function StatsOverview({ isLoading, stats }: StatsOverviewProps) {
  const cards = [
    {
      label: "Total Projects",
      value: String(stats?.totalProjects ?? 0),
      subtext: "Active projects",
      icon: <Building2 className="w-6 h-6" />,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      label: "Active Units",
      value: String(stats?.activeUnits ?? 0),
      subtext: "Available across projects",
      icon: <Home className="w-6 h-6" />,
      iconBg: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Total Leads",
      value: String(stats?.totalLeads ?? 0),
      subtext: "All-time leads",
      icon: <Users className="w-6 h-6" />,
      iconBg: "bg-orange-500/10 text-orange-600",
    },
    {
      label: "Revenue Pipeline",
      value: formatPipelineValue(stats?.pipelineValue ?? 0),
      subtext: "Available inventory value",
      icon: <TrendingUp className="w-6 h-6" />,
      iconBg: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <section aria-label="Dashboard statistics">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Overview</h2>
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 snap-x sm:snap-none scrollbar-hide">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[260px] sm:min-w-0 flex-shrink-0 snap-start bg-bg-card rounded-2xl border border-border p-5 flex items-start gap-4"
              >
                <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))
          : cards.map((stat) => (
              <Card
                key={stat.label}
                hoverable
                tabIndex={0}
                className="min-w-[260px] sm:min-w-0 flex-shrink-0 snap-start p-5 flex items-start gap-4 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <div
                  className={`p-3 rounded-lg ${stat.iconBg}`}
                  aria-hidden="true"
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-text-primary mt-1">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium mt-1 text-text-muted">
                    {stat.subtext}
                  </p>
                </div>
              </Card>
            ))}
      </div>
    </section>
  );
}
