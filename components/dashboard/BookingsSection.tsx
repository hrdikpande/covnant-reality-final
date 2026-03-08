"use client";

import { CalendarDays, Clock, User, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { EmptyState } from "./EmptyState";
import { CardSkeleton } from "./Skeletons";
import type { SiteVisitRow, VisitStatus } from "./types";
import type { BadgeVariant } from "@/types";

const STATUS_VARIANT: Record<VisitStatus, BadgeVariant> = {
    requested: "warning",
    confirmed: "success",
    completed: "default",
    cancelled: "danger",
};

const STATUS_LABEL: Record<VisitStatus, string> = {
    requested: "Pending Confirmation",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(timeStr: string): string {
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const amPm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${amPm}`;
}

interface BookingsSectionProps {
    bookings: SiteVisitRow[];
    loading: boolean;
}

export function BookingsSection({ bookings, loading }: BookingsSectionProps) {
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-40 bg-slate-200 animate-pulse rounded-lg" />
                    <div className="h-7 w-24 bg-slate-200 animate-pulse rounded-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">
                    Upcoming Bookings
                </h2>
                <span className="text-sm font-medium text-text-secondary bg-slate-100 px-3 py-1 rounded-full">
                    {bookings.length} upcoming
                </span>
            </div>

            {bookings.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {bookings.map((booking) => (
                        <Card key={booking.id} className="flex flex-col h-full">
                            <CardContent className="p-5 flex-1">
                                {/* Title + Badge */}
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg text-text-primary mb-2 line-clamp-2">
                                        {booking.property?.title ?? "Property"}
                                    </h3>
                                    <Badge variant={STATUS_VARIANT[booking.status]}>
                                        {STATUS_LABEL[booking.status]}
                                    </Badge>
                                </div>

                                {/* Date + Time */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5 p-3 sm:p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3 sm:w-1/2">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <CalendarDays className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted mb-0.5">
                                                Visit Date
                                            </p>
                                            <p className="text-sm font-semibold text-text-primary">
                                                {formatDate(booking.visit_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block w-px h-10 bg-slate-200" />
                                    <div className="flex items-center gap-3 sm:w-1/2">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted mb-0.5">
                                                Time
                                            </p>
                                            <p className="text-sm font-semibold text-text-primary">
                                                {formatTime(booking.visit_time)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Agent Contact */}
                                {booking.agent && (
                                    <div className="border-t border-border pt-4">
                                        <h4 className="text-sm font-medium text-text-primary mb-3">
                                            Agent Contact
                                        </h4>
                                        <div className="flex flex-col gap-2.5 text-sm">
                                            <div className="flex items-center gap-2 text-text-secondary">
                                                <User className="w-4 h-4 shrink-0" />
                                                <span className="font-medium text-text-primary">
                                                    {booking.agent.full_name ?? "Unknown Agent"}
                                                </span>
                                            </div>
                                            {booking.agent.phone && (
                                                <div className="flex items-center gap-2 text-text-secondary">
                                                    <Phone className="w-4 h-4 shrink-0" />
                                                    <a
                                                        href={`tel:${booking.agent.phone}`}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {booking.agent.phone}
                                                    </a>
                                                </div>
                                            )}
                                            {booking.agent.email && (
                                                <div className="flex items-center gap-2 text-text-secondary">
                                                    <Mail className="w-4 h-4 shrink-0" />
                                                    <a
                                                        href={`mailto:${booking.agent.email}`}
                                                        className="hover:text-primary transition-colors truncate"
                                                    >
                                                        {booking.agent.email}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            {(booking.status === "requested" || booking.status === "confirmed") && (
                                <CardFooter className="flex flex-col sm:flex-row gap-3">
                                    <Button variant="secondary" fullWidth>
                                        Reschedule
                                    </Button>
                                    <Button variant="danger" fullWidth>
                                        Cancel Booking
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<CalendarDays className="w-8 h-8" />}
                    title="No upcoming bookings"
                    description="You don&apos;t have any property visits scheduled right now."
                    actionLabel="Schedule a Visit"
                    actionHref="/search"
                />
            )}
        </div>
    );
}
