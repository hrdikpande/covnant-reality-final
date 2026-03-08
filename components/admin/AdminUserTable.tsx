"use client";

import { useState } from "react";
import { MoreVertical, Check, X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/lib/supabase/admin";

interface AdminUserTableProps {
    users: AdminUser[];
    onVerify: (userId: string, isVerified: boolean) => void;
}

const getRoleBadge = (role: string | null) => {
    switch (role) {
        case "admin":
            return "bg-red-50 text-red-700";
        case "agent":
            return "bg-purple-50 text-purple-700";
        case "builder":
            return "bg-blue-50 text-blue-700";
        case "buyer":
            return "bg-green-50 text-green-700";
        case "owner":
            return "bg-teal-50 text-teal-700";
        case "tenant":
            return "bg-amber-50 text-amber-700";
        default:
            return "bg-slate-100 text-slate-700";
    }
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export function AdminUserTable({ users, onVerify }: AdminUserTableProps) {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const toggleDropdown = (id: string) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const handleAction = (id: string, action: string) => {
        setOpenDropdownId(null);
        if (action === "verify") {
            onVerify(id, true);
        } else if (action === "unverify") {
            onVerify(id, false);
        }
    };

    return (
        <div className="bg-white border border-border rounded-xl shadow-sm text-sm">
            {/* Mobile view */}
            <div className="lg:hidden divide-y divide-border">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-semibold text-text-primary block">{user.full_name ?? "N/A"}</span>
                                    <span className="text-xs text-text-muted">{user.email ?? "N/A"}</span>
                                </div>
                                <span className={cn(
                                    "px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-md capitalize",
                                    getRoleBadge(user.role)
                                )}>
                                    {user.role ?? "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-text-muted">Joined {formatDate(user.created_at)}</span>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full",
                                        user.is_verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {user.is_verified ? "Verified" : "Unverified"}
                                    </span>
                                    <button
                                        onClick={() => handleAction(user.id, user.is_verified ? "unverify" : "verify")}
                                        className={cn(
                                            "p-1.5 rounded-md transition-colors",
                                            user.is_verified
                                                ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                                : "bg-green-50 text-green-600 hover:bg-green-100"
                                        )}
                                        aria-label={user.is_verified ? "Unverify" : "Verify"}
                                    >
                                        {user.is_verified ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center text-text-muted">
                        No users found.
                    </div>
                )}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-border">
                            <th className="px-6 py-4 font-semibold text-text-secondary">Name</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">Email</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">Role</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">City</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">Joined</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary">Status</th>
                            <th className="px-6 py-4 font-semibold text-text-secondary text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-text-primary">{user.full_name ?? "N/A"}</span>
                                    </td>
                                    <td className="px-6 py-4 text-text-muted">{user.email ?? "N/A"}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 text-[11px] font-semibold tracking-wider rounded-md capitalize",
                                            getRoleBadge(user.role)
                                        )}>
                                            {user.role ?? "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-primary">{user.city ?? "—"}</td>
                                    <td className="px-6 py-4 text-text-muted">{formatDate(user.created_at)}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full",
                                            user.is_verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                        )}>
                                            {user.is_verified ? "Verified" : "Unverified"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block text-left">
                                            <button
                                                onClick={() => toggleDropdown(user.id)}
                                                className="p-1.5 rounded-md hover:bg-slate-100 text-text-secondary transition-colors"
                                                aria-label="Actions"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {openDropdownId === user.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />
                                                    <div className="absolute right-0 z-20 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden text-left">
                                                        <div className="py-1">
                                                            {!user.is_verified ? (
                                                                <button
                                                                    onClick={() => handleAction(user.id, "verify")}
                                                                    className="flex items-center w-full px-4 py-2.5 text-sm text-text-primary hover:bg-slate-50 font-medium"
                                                                >
                                                                    <Check className="mr-2 h-4 w-4 text-green-600" />
                                                                    Verify User
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleAction(user.id, "unverify")}
                                                                    className="flex items-center w-full px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 font-medium"
                                                                >
                                                                    <ShieldAlert className="mr-2 h-4 w-4" />
                                                                    Unverify User
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
