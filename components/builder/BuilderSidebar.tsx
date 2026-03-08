"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  LayoutGrid,
  Users,
  Megaphone,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/components/AuthContext";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/builder" },
  { label: "Projects", icon: Building2, href: "/builder/projects" },
  { label: "Units", icon: LayoutGrid, href: "/builder/units" },
  { label: "Leads", icon: Users, href: "/builder/leads" },
  { label: "Marketing", icon: Megaphone, href: "/builder/marketing" },
  { label: "Analytics", icon: BarChart3, href: "/builder/analytics" },
];

export function BuilderSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border sticky top-0 bg-white z-40 w-full shrink-0">
        <span className="font-bold text-lg text-primary">Builder Panel</span>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 lg:sticky lg:top-0 flex flex-col overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand area */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between lg:block shrink-0">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Builder Panel</h2>
            <p className="text-xs text-text-secondary mt-0.5 lg:block hidden">
              Manage your projects
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 -mr-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/builder"
                ? pathname === "/builder"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
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
        <div className="p-4 border-t border-border/50 flex flex-col gap-1 shrink-0 mt-auto">
          <Link
            href="/builder/profile"
            onClick={() => setIsOpen(false)}
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
    </>
  );
}

