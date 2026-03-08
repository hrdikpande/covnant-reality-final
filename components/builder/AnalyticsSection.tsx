"use client";

import { BarChart3, Eye, Users, Percent, BadgeIndianRupee } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { BuilderAnalytics } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  if (value > 0) return `₹${value.toLocaleString("en-IN")}`;
  return "₹0";
}

interface AnalyticsSectionProps {
  isLoading?: boolean;
  analytics?: BuilderAnalytics;
}

export function AnalyticsSection({
  isLoading,
  analytics,
}: AnalyticsSectionProps) {
  const metrics = [
    {
      label: "Project Page Views",
      value: String(analytics?.projectViews ?? 0),
      icon: <Eye className="w-4 h-4" />,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      label: "Lead Volume",
      value: String(analytics?.totalLeads ?? 0),
      icon: <Users className="w-4 h-4" />,
      iconBg: "bg-orange-100 text-orange-600",
    },
    {
      label: "Sell-through Rate",
      value: `${analytics?.sellThroughRate ?? 0}%`,
      icon: <Percent className="w-4 h-4" />,
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      label: "Pipeline Value",
      value: formatCurrency(analytics?.pipelineValue ?? 0),
      icon: <BadgeIndianRupee className="w-4 h-4" />,
      iconBg: "bg-emerald-100 text-emerald-600",
    },
  ];

  const monthlyData = analytics?.monthlyData ?? [];

  return (
    <section aria-label="Analytics overview">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Analytics Overview
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <BarChart3 className="w-4 h-4 mr-2" aria-hidden="true" />
          Detailed Report
        </Button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="p-4 sm:p-5 flex flex-col justify-between"
            >
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="flex items-end justify-between mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </Card>
          ))
          : metrics.map((metric) => (
            <Card
              key={metric.label}
              className="p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200 group"
            >
              <span className="text-text-secondary font-medium text-xs sm:text-sm">
                {metric.label}
              </span>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-xl sm:text-2xl font-bold text-text-primary">
                  {metric.value}
                </span>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    metric.iconBg,
                  )}
                  aria-hidden="true"
                >
                  {metric.icon}
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Real Chart */}
      <Card className="mt-6 p-5 sm:p-6">
        <h3 className="text-base font-semibold text-text-primary mb-6">
          Monthly Lead Growth
        </h3>

        {isLoading ? (
          <Skeleton className="w-full h-64 sm:h-80 rounded-xl" />
        ) : monthlyData.length > 0 ? (
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    padding: "12px 16px",
                  }}
                  cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingTop: "16px", fontSize: "13px" }}
                />
                <Bar
                  dataKey="leads"
                  name="Leads Generated"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="conversions"
                  name="Conversions"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            className="w-full h-64 sm:h-80 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center"
            role="img"
            aria-label="No chart data available"
          >
            <BarChart3
              className="w-8 h-8 text-slate-300 mb-3"
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-slate-400">
              No lead data available yet
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Chart will populate as leads come in
            </span>
          </div>
        )}
      </Card>
    </section>
  );
}
