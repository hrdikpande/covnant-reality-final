"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CalendarIcon,
  PhoneCall,
  Check,
  Plus,
  MessageCircle,
  Loader2,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  fetchFollowUps,
  markFollowUpDone,
  addFollowUp,
  type FollowUpRow,
} from "@/lib/supabase/agent-dashboard";

export function FollowUpSection() {
  const [followUps, setFollowUps] = useState<FollowUpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"call" | "meeting" | "whatsapp">(
    "call",
  );
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadFollowUps = useCallback(async () => {
    try {
      const data = await fetchFollowUps();
      setFollowUps(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load follow-ups";
      setError(msg);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchD = async () => {
      await loadFollowUps();
      if (!cancelled) setLoading(false);
    }
    fetchD();
    return () => {
      cancelled = true;
    };
  }, [loadFollowUps]);

  const handleMarkDone = useCallback(
    async (id: string) => {
      // Optimistic remove
      setFollowUps((prev) => prev.filter((f) => f.id !== id));
      const result = await markFollowUpDone(id);
      if (!result.success) {
        // Refetch on failure
        loadFollowUps();
      }
    },
    [loadFollowUps],
  );

  const handleAddReminder = async () => {
    if (!formName.trim() || !formDate || !formTime) return;
    setSubmitting(true);
    setSubmitError(null);
    const scheduledAt = new Date(`${formDate}T${formTime}`).toISOString();
    const result = await addFollowUp({
      lead_name: formName.trim(),
      reminder_type: formType,
      scheduled_at: scheduledAt,
    });
    setSubmitting(false);
    if (result.success) {
      setShowModal(false);
      setFormName("");
      setFormType("call");
      setFormDate("");
      setFormTime("");
      loadFollowUps();
    } else {
      setSubmitError(result.error ?? "Failed to add reminder");
    }
  };

  const formatScheduledDate = (
    dateStr: string,
  ): { date: string; time: string } => {
    const d = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let date: string;
    if (d.toDateString() === now.toDateString()) date = "Today";
    else if (d.toDateString() === tomorrow.toDateString()) date = "Tomorrow";
    else
      date = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

    const time = d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { date, time };
  };

  return (
    <>
      <section className="px-4 sm:px-0">
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary">Follow-ups</h2>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
              {followUps.length}
            </span>
          </div>

          {/* Add Reminder Button */}
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto"
            onClick={() => setShowModal(true)}
          >
            Add Reminder
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <Card>
            <CardContent className="p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {!loading && error && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Empty */}
        {!loading && !error && followUps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-sm text-text-secondary">
                No pending follow-ups. Add a reminder to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {/* List Area */}
        {!loading && !error && followUps.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-border/50">
                {followUps.map((followUp) => {
                  const reminderLabel =
                    followUp.reminder_type === "call"
                      ? "Call"
                      : followUp.reminder_type === "whatsapp"
                        ? "WhatsApp"
                        : "Meeting";

                  const TypeIcon =
                    followUp.reminder_type === "call"
                      ? PhoneCall
                      : followUp.reminder_type === "whatsapp"
                        ? MessageCircle
                        : Bell;

                  const typeColorClass =
                    followUp.reminder_type === "call"
                      ? "text-blue-600 bg-blue-50"
                      : followUp.reminder_type === "whatsapp"
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-purple-600 bg-purple-50";

                  const { date, time } = formatScheduledDate(
                    followUp.scheduled_at,
                  );

                  return (
                    <div
                      key={followUp.id}
                      className="flex flex-col gap-3 p-4 hover:bg-slate-50 transition-colors"
                    >
                      {/* Left Content: Icon + Details */}
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Icon */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${typeColorClass}`}
                        >
                          <TypeIcon className="w-4 h-4" />
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <h4 className="font-semibold text-text-primary text-sm truncate">
                            {followUp.lead_name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-text-primary">
                            <CalendarIcon className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                            <span className="whitespace-nowrap">
                              {date} at {time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-text-secondary">
                            <span className="w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                            <span>{reminderLabel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action button */}
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={
                          <Check className="w-4 h-4 text-emerald-600" />
                        }
                        className="w-full justify-center text-text-secondary hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50"
                        onClick={() => handleMarkDone(followUp.id)}
                      >
                        Mark as Done
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Add Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary">
                Add Follow-up Reminder
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSubmitError(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">
              {/* Lead Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-primary">
                  Lead / Contact Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full h-10 px-3 rounded-xl border border-border bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Reminder Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-primary">
                  Reminder Type
                </label>
                <div className="flex items-center gap-2">
                  {[
                    {
                      value: "call" as const,
                      label: "Call",
                      icon: PhoneCall,
                      color: "text-blue-600 border-blue-200 bg-blue-50",
                    },
                    {
                      value: "meeting" as const,
                      label: "Meeting",
                      icon: Bell,
                      color: "text-purple-600 border-purple-200 bg-purple-50",
                    },
                    {
                      value: "whatsapp" as const,
                      label: "WhatsApp",
                      icon: MessageCircle,
                      color:
                        "text-emerald-600 border-emerald-200 bg-emerald-50",
                    },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const isActive = formType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormType(opt.value)}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl border text-sm font-medium transition-all ${isActive
                            ? opt.color + " ring-2 ring-primary/20"
                            : "border-border bg-white text-text-secondary hover:bg-slate-50"
                          }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-primary">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {submitError && (
              <p className="text-xs text-red-600 font-medium">{submitError}</p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowModal(false);
                  setSubmitError(null);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddReminder}
                disabled={
                  submitting || !formName.trim() || !formDate || !formTime
                }
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding…
                  </span>
                ) : (
                  "Add Reminder"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
