"use client";

import { useEffect, useState } from "react";
import { User, Phone, Save, Loader2, Building, Mail } from "lucide-react";
import { getOwnerProfile, updateOwnerProfile } from "@/lib/supabase/owner";
import { useAuth } from "@/components/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function OwnerProfileView() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Mutable form fields
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyPhone, setCompanyPhone] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            const data = await getOwnerProfile(user.id);
            if (data) {
                setFullName(data.full_name || "");
                setPhone(data.phone || "");
                setCompanyName(data.company_name || "");
                setCompanyPhone(data.company_phone || "");
                setCompanyEmail(data.company_email || "");
                setCompanyAddress(data.company_address || "");
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setMessage({ type: "", text: "" });

        const updates = {
            full_name: fullName,
            phone,
            company_name: companyName,
            company_phone: companyPhone,
            company_email: companyEmail,
            company_address: companyAddress,
        };

        const result = await updateOwnerProfile(user.id, updates);

        if (result.success) {
            setMessage({ type: "success", text: "Profile updated successfully." });
        } else {
            setMessage({ type: "error", text: result.error || "Failed to update profile." });
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {message.text && (
                <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border bg-slate-50/50">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Personal Information
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">Manage your personal details used for account access.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Email Address (Read-only)</label>
                        <Input
                            value={user?.email || ""}
                            disabled
                            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                            className="bg-slate-50 cursor-not-allowed text-slate-500 border-slate-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Role (Read-only)</label>
                        <Input
                            value="Property Owner"
                            disabled
                            className="bg-slate-50 cursor-not-allowed text-slate-500 border-slate-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Full Name</label>
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            leftIcon={<User className="w-4 h-4 text-text-muted" />}
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Phone Number</label>
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            leftIcon={<Phone className="w-4 h-4 text-text-muted" />}
                            placeholder="Enter your phone number"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border bg-slate-50/50">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <Building className="w-5 h-5 text-primary" />
                        Entity Details (Optional)
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">If you represent an entity or company, provide details here.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Company / Entity Name</label>
                        <Input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Venture Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Contact Email</label>
                        <Input
                            value={companyEmail}
                            onChange={(e) => setCompanyEmail(e.target.value)}
                            leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
                            placeholder="support@company.com"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-text-primary">Entity Address</label>
                        <Input
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                            placeholder="Office or Headquarters Address"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="min-w-[150px] h-12 flex items-center gap-2 font-semibold"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
