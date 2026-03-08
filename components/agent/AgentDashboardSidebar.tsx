"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  Headset,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthContext";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/agent/dashboard" },
  { label: "Listings", icon: Building2, href: "/agent/listings" },
  { label: "Leads", icon: Users, href: "/agent/leads" },
  { label: "CRM", icon: Headset, href: "/agent/crm" },
  { label: "Performance", icon: BarChart3, href: "/agent/performance" },
];

export function AgentDashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen bg-white border-r border-border overflow-y-auto">
      {/* Brand area */}
      <div className="p-6 border-b border-border/50">
        <h2 className="text-lg font-bold text-text-primary">Agent Panel</h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Manage your business
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/agent" || item.href === "/agent/dashboard"
              ? pathname === "/agent" || pathname === "/agent/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-slate-50 hover:text-text-primary",
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border/50 flex flex-col gap-1">
        <Link
          href="/agent/profile"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-slate-50 hover:text-text-primary transition-colors"
        >
          <User className="w-5 h-5 shrink-0" />
          <span>Profile</span>
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
