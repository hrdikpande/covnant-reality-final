"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname();
    const isAgentRoute = pathname?.startsWith("/agent");
    const isDashboardRoute = pathname?.startsWith("/dashboard");
    const isBuilderRoute = pathname?.startsWith("/builder");
    const isAdminRoute = pathname?.startsWith("/admin");
    const isOwnerRoute = pathname?.startsWith("/owner");
    const isDedicatedLayout = isAgentRoute || isDashboardRoute || isBuilderRoute || isAdminRoute || isOwnerRoute;

    return (
        <div className="flex flex-col min-h-svh">
            {!isDedicatedLayout && <Header />}

            {/* Scrollable main content — accounts for header (56px) + bottom nav (64px-80px + safe area) */}
            <main className="flex-1 pb-24 lg:pb-0">
                {children}
            </main>

            {!isDedicatedLayout && <Footer />}

            {!isDedicatedLayout && <BottomNav />}
        </div>
    );
}
