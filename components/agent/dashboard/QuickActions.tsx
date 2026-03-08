"use client";

import Link from "next/link";
import { Users, CalendarPlus, FileEdit, UserCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function QuickActions() {
    const actions = [
        {
            title: "View Leads",
            description: "Manage your CRM",
            icon: Users,
            href: "/agent/leads",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Schedule Visit",
            description: "Plan a site visit",
            icon: CalendarPlus,
            href: "/agent/leads", // Assuming visit scheduling happens from leads
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "Update Lead Status",
            description: "Move deals forward",
            icon: FileEdit,
            href: "/agent/crm",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Edit Profile",
            description: "Update your details",
            icon: UserCircle,
            href: "/agent/profile",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <Card>
            <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-4">
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={index}
                                href={action.href}
                                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-slate-50 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-full ${action.bgColor} flex items-center justify-center shrink-0`}>
                                    <Icon className={`w-5 h-5 ${action.color}`} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm text-text-primary">
                                        {action.title}
                                    </span>
                                    <span className="text-xs text-text-secondary">
                                        {action.description}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
