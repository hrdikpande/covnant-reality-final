"use client";

import { Home, Search, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    icon: React.ElementType;
    href: string;
}

export function BottomNav() {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        { label: "Home", icon: Home, href: "/" },
        { label: "Search", icon: Search, href: "/search" },
        { label: "Blog", icon: BookOpen, href: "/blog" },
    ];

    return (
        <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-t border-border pb-[env(safe-area-inset-bottom)] lg:hidden supports-[backdrop-filter]:bg-white/60">
            <div className="flex items-center justify-around h-16 sm:h-20 max-w-lg sm:max-w-3xl mx-auto px-4 sm:px-12">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-1 w-16 sm:w-20 py-1 transition-all duration-300",
                                isActive
                                    ? "text-primary"
                                    : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            <div className="flex items-center justify-center h-6 w-6 transition-all duration-300">
                                <item.icon className={cn(
                                    "h-5 w-5 sm:h-6 sm:w-6",
                                    isActive && "stroke-[2.5px]"
                                )} />
                            </div>
                            <span className={cn(
                                "text-[10px] sm:text-[11px] font-bold leading-tight transition-all",
                                isActive ? "opacity-100" : "opacity-70"
                            )}>{item.label}</span>

                            {isActive && (
                                <span className="absolute top-0 w-1 h-1 rounded-full bg-primary" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
