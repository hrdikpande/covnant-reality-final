"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthContext";
import { PostPropertyContent, type FormData } from "@/app/post-property/PostPropertyContent";
import { submitAdminProperty } from "@/lib/supabase/submit-property";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    role: string;
}

export default function AdminPropertyCreatePage() {
    const { user, userRole } = useAuth();
    const router = useRouter();
    const supabase = createClient();
    const [targetUserRole, setTargetUserRole] = useState<string>("");
    const [targetUserId, setTargetUserId] = useState<string>("");
    const [usersList, setUsersList] = useState<UserProfile[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const fetchUsers = useCallback(async (role: string) => {
        setLoadingUsers(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, email, role")
            .eq("role", role.toLowerCase());

        if (!error && data) {
            setUsersList(data);
        }
        setTargetUserId("");
        setLoadingUsers(false);
    }, [supabase]);

    useEffect(() => {
        if (targetUserRole) {
            queueMicrotask(() => fetchUsers(targetUserRole));
        } else {
            queueMicrotask(() => {
                setUsersList([]);
                setTargetUserId("");
            });
        }
    }, [targetUserRole, fetchUsers]);

    const handleCustomSubmit = async (formData: FormData) => {
        if (!user || userRole !== "admin") throw new Error("Unauthorized");
        if (!targetUserId) throw new Error("Please select a target user.");
        await submitAdminProperty(supabase, user.id, targetUserId, formData);
    };

    if (userRole !== "admin") {
        return <div className="p-8 text-center text-red-500">Access Denied: Admin only.</div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin/properties" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Properties
                </Link>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary mt-2">Create Property For User</h1>
                <p className="text-text-muted text-sm max-w-2xl">
                    Add a new property listing on behalf of an Owner, Agent, or Builder.
                </p>
            </div>

            {/* Target User Selector */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-text-primary">1. Select Listing Owner</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">User Role</label>
                        <select
                            value={targetUserRole}
                            onChange={(e) => setTargetUserRole(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-text-primary"
                        >
                            <option value="">Select Role...</option>
                            <option value="Owner">Owner</option>
                            <option value="Agent">Agent</option>
                            <option value="Builder">Builder</option>
                        </select>
                    </div>

                    {targetUserRole && (
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Select User</label>
                            <div className="relative">
                                <select
                                    value={targetUserId}
                                    onChange={(e) => setTargetUserId(e.target.value)}
                                    disabled={loadingUsers || usersList.length === 0}
                                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white text-text-primary disabled:bg-slate-50 disabled:text-text-muted appearance-none"
                                >
                                    <option value="">
                                        {loadingUsers ? "Loading users..." : usersList.length === 0 ? "No users found" : "Select a user..."}
                                    </option>
                                    {usersList.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.full_name || u.email}
                                        </option>
                                    ))}
                                </select>
                                {loadingUsers && (
                                    <Loader2 className="w-4 h-4 animate-spin text-primary absolute right-8 top-3.5" />
                                )}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Property Form */}
            {targetUserId ? (
                <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden mt-6 pb-8">
                    <div className="p-6 border-b border-border bg-slate-50/50">
                        <h2 className="text-lg font-semibold text-text-primary">2. Property Details</h2>
                    </div>
                    {/* The original PostPropertyContent assumes min-h-[calc(100vh-120px)], we wrap it to constrain it visually if needed, but it scales well. */}
                    <div className="-mt-6 -mx-4 md:-mx-6 lg:-mx-8">
                        <PostPropertyContent
                            bypassRoleRedirect={true}
                            initialRole={targetUserRole}
                            customSubmit={handleCustomSubmit}
                            onSuccess={() => router.push("/admin/properties")}
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 border border-border rounded-xl p-8 text-center text-text-muted mt-6 shadow-inner">
                    <p>Please select a target user above to proceed with property posting.</p>
                </div>
            )}
        </div>
    );
}
