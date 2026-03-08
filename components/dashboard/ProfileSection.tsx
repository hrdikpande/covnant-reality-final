"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProfileSkeleton } from "./Skeletons";
import { updateProfile } from "@/lib/supabase/dashboard";
import type { UserProfile } from "./types";

interface ProfileSectionProps {
    profile: UserProfile | null;
    loading: boolean;
}

export function ProfileSection({ profile, loading }: ProfileSectionProps) {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: profile?.full_name ?? "",
        phone: profile?.phone ?? "",
        city: profile?.city ?? "",
    });

    // Sync form data when profile changes
    if (profile && !editing) {
        if (
            formData.full_name !== (profile.full_name ?? "") ||
            formData.phone !== (profile.phone ?? "") ||
            formData.city !== (profile.city ?? "")
        ) {
            setFormData({
                full_name: profile.full_name ?? "",
                phone: profile.phone ?? "",
                city: profile.city ?? "",
            });
        }
    }

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!profile) {
        return (
            <div className="max-w-3xl">
                <p className="text-text-secondary">Unable to load profile data.</p>
            </div>
        );
    }

    const handleSave = async () => {
        setSaving(true);
        const result = await updateProfile(formData);
        setSaving(false);
        if (result.success) {
            setEditing(false);
        } else {
            console.error("Failed to save profile:", result.error);
        }
    };

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-text-primary mb-1">
                    My Profile
                </h2>
                <p className="text-sm text-text-secondary">
                    Manage your personal information and preferences.
                </p>
            </div>

            {/* Section 1: Personal Info */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-border">
                    <h3 className="font-semibold text-lg text-text-primary">
                        Personal Information
                    </h3>
                    {editing ? (
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<X className="w-4 h-4" />}
                                onClick={() => {
                                    setEditing(false);
                                    setFormData({
                                        full_name: profile.full_name ?? "",
                                        phone: profile.phone ?? "",
                                        city: profile.city ?? "",
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                leftIcon={<Save className="w-4 h-4" />}
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Edit2 className="w-4 h-4" />}
                            onClick={() => setEditing(true)}
                        >
                            Edit
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {editing ? (
                            <>
                                <EditField
                                    label="Full Name"
                                    icon={<User className="w-4 h-4 text-text-muted" />}
                                    value={formData.full_name}
                                    onChange={(v) => setFormData((prev) => ({ ...prev, full_name: v }))}
                                />
                                <InfoField
                                    label="Email Address"
                                    value={profile.email ?? "—"}
                                    icon={<Mail className="w-4 h-4 text-text-muted" />}
                                />
                                <EditField
                                    label="Phone Number"
                                    icon={<Phone className="w-4 h-4 text-text-muted" />}
                                    value={formData.phone}
                                    onChange={(v) => setFormData((prev) => ({ ...prev, phone: v }))}
                                />
                                <EditField
                                    label="City"
                                    icon={<MapPin className="w-4 h-4 text-text-muted" />}
                                    value={formData.city}
                                    onChange={(v) => setFormData((prev) => ({ ...prev, city: v }))}
                                />
                            </>
                        ) : (
                            <>
                                <InfoField
                                    label="Full Name"
                                    value={profile.full_name ?? "—"}
                                    icon={<User className="w-4 h-4 text-text-muted" />}
                                />
                                <InfoField
                                    label="Email Address"
                                    value={profile.email ?? "—"}
                                    icon={<Mail className="w-4 h-4 text-text-muted" />}
                                />
                                <InfoField
                                    label="Phone Number"
                                    value={profile.phone ?? "—"}
                                    icon={<Phone className="w-4 h-4 text-text-muted" />}
                                />
                                <InfoField
                                    label="City"
                                    value={profile.city ?? "—"}
                                    icon={<MapPin className="w-4 h-4 text-text-muted" />}
                                />
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}

/* ─── Sub components ──────────────────────────────────────────────────────── */

function InfoField({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div>
            <p className="text-sm text-text-secondary mb-1">{label}</p>
            <p className="font-medium text-text-primary flex items-center gap-2">
                {icon}
                {value}
            </p>
        </div>
    );
}

function EditField({
    label,
    value,
    icon,
    onChange,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <label className="text-sm text-text-secondary mb-1 block">{label}</label>
            <div className="flex items-center gap-2">
                {icon}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>
        </div>
    );
}
