"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Home,
  Users,
  Handshake,
  Eye,
  Trophy,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  fetchAgentPerformance,
  type AgentPerformanceData,
} from "@/lib/supabase/agent-dashboard";

export function AgentStatsSection() {
  const [perf, setPerf] = useState<AgentPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAgentPerformance()
      .then((data) => {
        if (!cancelled) setPerf(data);
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
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Performance Overview
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  const stats = [
    {
      title: "Total Listings",
      value: String(perf?.totalListings ?? 0),
      trend: "",
      trendPositive: true,
      icon: Building2,
    },
    {
      title: "Active Listings",
      value: String(perf?.activeListings ?? 0),
      trend: "",
      trendPositive: true,
      icon: Home,
    },
    {
      title: "Total Leads",
      value: String(perf?.totalLeads ?? 0),
      trend: "",
      trendPositive: true,
      icon: Users,
    },
    {
      title: "Closed Deals",
      value: String(perf?.closedLeads ?? 0),
      trend: "",
      trendPositive: true,
      icon: Handshake,
    },
    {
      title: "Total Views",
      value: perf?.totalViews
        ? perf.totalViews >= 1000
          ? `${(perf.totalViews / 1000).toFixed(1)}K`
          : String(perf.totalViews)
        : "0",
      trend: "",
      trendPositive: true,
      icon: Eye,
    },
    {
      title: "Conversion Rate",
      value: `${perf?.conversionRate ?? 0}%`,
      trend: "",
      trendPositive: true,
      icon: Trophy,
    },
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        Performance Overview
      </h2>

      {/* Mobile: Horizontal Scroll | Tablet: 2-col | Desktop: 3-col */}
      <div className="flex overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 sm:pb-0 hide-scrollbar">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card
              key={index}
              className="min-w-[240px] w-[75vw] sm:min-w-0 sm:w-auto snap-center shrink-0"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-text-secondary">
                      {stat.title}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-text-primary mt-1">
                      {stat.value}
                    </span>
                  </div>

                  {/* Icon Container */}
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {stat.trend && (
                  <div className="mt-4">
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-md",
                        stat.trendPositive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600",
                      )}
                    >
                      {stat.trend}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
