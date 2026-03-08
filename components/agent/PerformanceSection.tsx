"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Users,
  TrendingUp,
  Trophy,
  ArrowUpRight,
  Loader2,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  fetchAgentPerformance,
  fetchViewsOverTime,
  fetchLeadsByProperty,
  type AgentPerformanceData,
  type ViewsDataPoint,
  type LeadsByPropertyPoint,
} from "@/lib/supabase/agent-dashboard";

interface Metric {
  id: string;
  label: string;
  value: string;
  icon: React.ElementType;
}

export function PerformanceSection() {
  const [perf, setPerf] = useState<AgentPerformanceData | null>(null);
  const [viewsData, setViewsData] = useState<ViewsDataPoint[]>([]);
  const [leadsData, setLeadsData] = useState<LeadsByPropertyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchAgentPerformance(),
      fetchViewsOverTime(),
      fetchLeadsByProperty(),
    ])
      .then(([perfData, views, leads]) => {
        if (cancelled) return;
        setPerf(perfData);
        setViewsData(views);
        setLeadsData(leads);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const metrics: Metric[] = perf
    ? [
        {
          id: "m1",
          label: "Total Views",
          value:
            perf.totalViews >= 1000
              ? `${(perf.totalViews / 1000).toFixed(1)}K`
              : String(perf.totalViews),
          icon: Eye,
        },
        {
          id: "m2",
          label: "Total Leads",
          value: String(perf.totalLeads),
          icon: Users,
        },
        {
          id: "m3",
          label: "Conversion Rate",
          value: `${perf.conversionRate}%`,
          icon: TrendingUp,
        },
        {
          id: "m4",
          label: "Closed Deals",
          value: String(perf.closedLeads),
          icon: Trophy,
        },
        {
          id: "m5",
          label: "Active Listings",
          value: String(perf.activeListings),
          icon: ArrowUpRight,
        },
      ]
    : [];

  const viewsMax = Math.max(...viewsData.map((v) => v.count), 1);
  const leadsMax = Math.max(...leadsData.map((l) => l.count), 1);

  return (
    <section className="px-4 sm:px-0">
      {/* Header Area */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary">
          Performance Analytics
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Key metrics and insights for your property listings.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Metrics Grid */}
      {!loading && metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.id} className="border-border">
                <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                  {/* Top: Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-text-secondary" />
                    </div>
                  </div>

                  {/* Bottom: Value & Label */}
                  <div className="flex flex-col">
                    <span className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                      {metric.value}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-text-secondary mt-1 line-clamp-1">
                      {metric.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Charts Section */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Over Time Bar Chart */}
          <Card>
            <CardContent className="p-5 sm:p-6 flex flex-col h-80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-primary">Views Over Time</h3>
                <span className="text-xs font-medium text-text-secondary px-2 py-1 bg-slate-50 rounded-md">
                  Last 30 Days
                </span>
              </div>
              {viewsData.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
                  <Eye className="w-8 h-8 text-slate-200 mb-2" />
                  <span className="text-sm font-medium">
                    No view data available yet
                  </span>
                </div>
              ) : (
                <div className="flex-1 flex items-end gap-[2px] overflow-hidden">
                  {viewsData.map((point, i) => {
                    const heightPct =
                      viewsMax > 0 ? (point.count / viewsMax) * 100 : 0;
                    const dayLabel = new Date(
                      point.date + "T00:00:00",
                    ).toLocaleDateString("en-IN", { day: "numeric" });
                    const isWeekStart =
                      new Date(point.date + "T00:00:00").getDay() === 1;
                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center justify-end h-full group relative"
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {point.count} views ·{" "}
                          {new Date(
                            point.date + "T00:00:00",
                          ).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        {/* Bar */}
                        <div
                          className="w-full rounded-t-sm bg-primary/70 hover:bg-primary transition-colors min-h-[2px]"
                          style={{ height: `${Math.max(heightPct, 2)}%` }}
                        />
                        {/* Day label (show every Monday) */}
                        {isWeekStart && (
                          <span className="text-[9px] text-text-secondary mt-1 leading-none">
                            {dayLabel}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leads by Property Horizontal Bar Chart */}
          <Card>
            <CardContent className="p-5 sm:p-6 flex flex-col h-80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-primary">
                  Leads by Property
                </h3>
                <span className="text-xs font-medium text-text-secondary px-2 py-1 bg-slate-50 rounded-md">
                  Top 5
                </span>
              </div>
              {leadsData.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
                  <BarChart3 className="w-8 h-8 text-slate-200 mb-2" />
                  <span className="text-sm font-medium">
                    No lead data available yet
                  </span>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center gap-4">
                  {leadsData.map((item, i) => {
                    const widthPct =
                      leadsMax > 0 ? (item.count / leadsMax) * 100 : 0;
                    const colors = [
                      "bg-primary",
                      "bg-emerald-500",
                      "bg-orange-400",
                      "bg-purple-500",
                      "bg-blue-400",
                    ];
                    return (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-text-primary line-clamp-1 max-w-[70%]">
                            {item.property}
                          </span>
                          <span className="font-bold text-text-primary shrink-0">
                            {item.count}
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-500`}
                            style={{ width: `${Math.max(widthPct, 3)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
