"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Building2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  fetchAgentMeetings,
  type AgentMeetingRow,
} from "@/lib/supabase/agent-dashboard";

type MeetingType = "Site Visit" | "Call" | "Office Meeting";

const TYPE_STYLES: Record<
  MeetingType,
  { badge: "default" | "success" | "warning" | "outline"; color: string }
> = {
  "Site Visit": { badge: "success", color: "text-emerald-600 bg-emerald-50" },
  Call: { badge: "default", color: "text-blue-600 bg-blue-50" },
  "Office Meeting": { badge: "warning", color: "text-orange-600 bg-orange-50" },
};

function formatVisitDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function formatVisitTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${suffix}`;
}

export function UpcomingMeetingsSection() {
  const [meetings, setMeetings] = useState<AgentMeetingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAgentMeetings()
      .then((data) => {
        if (!cancelled) setMeetings(data);
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
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">
            Upcoming Meetings
          </h2>
        </div>
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (meetings.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">
            Upcoming Meetings
          </h2>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-text-secondary">
              No upcoming meetings scheduled.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">
            Upcoming Meetings
          </h2>
          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
            {meetings.length}
          </span>
        </div>
        <Link
          href="/agent/crm"
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Meeting Cards */}
      <div className="flex flex-col gap-3">
        {meetings.map((meeting) => {
          const meetingType: MeetingType = "Site Visit";
          const { badge } = TYPE_STYLES[meetingType];
          const dateLabel = formatVisitDate(meeting.visit_date);
          const timeLabel = formatVisitTime(meeting.visit_time);
          const isToday = dateLabel === "Today";
          const location = meeting.property?.city
            ? `${meeting.property.address ?? ""}, ${meeting.property.city}`
            : "Location TBD";

          return (
            <Card
              key={meeting.id}
              className={isToday ? "border-primary/30 bg-primary/[0.02]" : ""}
            >
              <CardContent className="p-4 flex flex-col gap-3">
                {/* Top row: date/time + badge */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-3">
                    {/* Date chip */}
                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${isToday ? "bg-primary text-white" : "bg-slate-100 text-text-secondary"}`}
                    >
                      <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                      <span>{dateLabel}</span>
                    </div>
                    {/* Time */}
                    <div className="flex items-center gap-1 text-sm font-medium text-text-primary">
                      <Clock className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                      <span>{timeLabel}</span>
                    </div>
                  </div>
                  <Badge variant={badge}>{meetingType}</Badge>
                </div>

                {/* Client + Property */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold text-text-primary">
                      {meeting.buyer?.full_name ?? "Unknown Client"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Building2 className="w-4 h-4 shrink-0 text-text-secondary/70" />
                    <span className="line-clamp-1">
                      {meeting.property?.title ?? "Unknown Property"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
