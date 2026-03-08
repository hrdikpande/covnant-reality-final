"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "./AuthContext";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { session, userRole, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            // Not authenticated → send to login
            if (!session) {
                router.replace("/login");
                return;
            }

            // Authenticated but role doesn't match → send to home
            if (userRole && !allowedRoles.includes(userRole)) {
                router.replace("/");
            }
        }
    }, [session, userRole, isLoading, allowedRoles, router]);

    // Show loading spinner during session hydration
    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
            </div>
        );
    }

    // Not authenticated or role mismatch — show nothing (redirect is pending)
    if (!session || (userRole && !allowedRoles.includes(userRole))) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
