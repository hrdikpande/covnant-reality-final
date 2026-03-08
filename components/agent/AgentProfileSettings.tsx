"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Lock,
  Briefcase,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  fetchAgentProfile,
  updateAgentProfile,
  uploadAvatar,
  type AgentProfileRow,
} from "@/lib/supabase/agent-dashboard";

export function AgentProfileSettings() {
  const [activeTab, setActiveTab] = useState<"general" | "security">("general");
  const [profile, setProfile] = useState<AgentProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Avatar upload states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // basic validation
    if (file.size > 2 * 1024 * 1024) {
      setUploadMsg("Error: File size must be under 2MB.");
      setTimeout(() => setUploadMsg(null), 3000);
      return;
    }

    setUploadingAvatar(true);
    setUploadMsg(null);

    const { success, url, error } = await uploadAvatar(file);
    if (success && url) {
      // Intentionally optimistic UI update, then update the actual db record
      if (profile) setProfile({ ...profile, avatar_url: url });
      await updateAgentProfile({ avatar_url: url });
      setUploadMsg("Avatar updated successfully!");
    } else {
      setUploadMsg(`Error: ${error || "Failed to upload avatar."}`);
    }

    setUploadingAvatar(false);
    setTimeout(() => setUploadMsg(null), 3000);
    // clear input
    e.target.value = "";
  };

  useEffect(() => {
    let cancelled = false;
    fetchAgentProfile()
      .then((p) => {
        if (!cancelled && p) {
          setProfile(p);
          setFullName(p.full_name ?? "");
          setEmail(p.email ?? "");
          setPhone(p.phone ?? "");
          setCity(p.city ?? "");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    const result = await updateAgentProfile({
      full_name: fullName,
      phone,
      city,
    });
    setSaving(false);
    if (result.success) {
      setSaveMsg("Profile updated successfully!");
      setTimeout(() => setSaveMsg(null), 3000);
    } else {
      setSaveMsg(`Error: ${result.error ?? "Failed to save"}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Left Sidebar Menu & Avatar */}
      <div className="lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
        {/* Avatar Card */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative group bg-slate-100 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="Agent Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
                {/* Overlay / Edit Button */}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white flex-col gap-1">
                  {uploadingAvatar ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6" />
                      <span className="text-[10px] font-medium leading-none">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
            </div>
            <h3 className="text-lg font-bold text-text-primary">
              {fullName || "Agent"}
            </h3>
            <p className="text-sm font-medium text-text-secondary mt-1 max-w-[200px]">
              {profile?.role ?? "Agent"} @ Covnant Reality India PVT LTD
            </p>

            {profile?.is_verified && (
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-max mx-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Agent</span>
              </div>
            )}

            {uploadMsg && (
              <div className={`mt-3 text-xs font-medium px-2 py-1 rounded ${uploadMsg.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {uploadMsg}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Menu (Tabs) */}
        <Card>
          <CardContent className="p-2 sm:p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap flex-1 lg:flex-initial justify-center lg:justify-start ${activeTab === "general"
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                }`}
            >
              <User className="w-4 h-4 shrink-0" />
              General Information
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap flex-1 lg:flex-initial justify-center lg:justify-start ${activeTab === "security"
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              Password & Security
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === "general" && (
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="p-5 sm:p-6 border-b border-border/50">
                <h2 className="text-lg font-bold text-text-primary">
                  Personal Details
                </h2>
                <p className="text-sm text-text-secondary">
                  Update your photo and personal details here.
                </p>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-text-secondary" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-text-secondary" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        readOnly
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-slate-50 text-sm font-medium text-text-secondary outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Phone className="w-4 h-4 text-text-secondary" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary">
                      City
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <MapPin className="w-4 h-4 text-text-secondary" />
                      </div>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. Bengaluru"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">
                    RERA Registration ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Briefcase className="w-4 h-4 text-text-secondary" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. PRM/KA/RERA/1251/310/211234"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Changes */}
            <div className="flex items-center justify-between pt-2">
              {saveMsg && (
                <span
                  className={`text-sm font-medium ${saveMsg.startsWith("Error") ? "text-red-600" : "text-emerald-600"}`}
                >
                  {saveMsg}
                </span>
              )}
              <div className="ml-auto">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    "Save All Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="p-5 sm:p-6 border-b border-border/50">
                <h2 className="text-lg font-bold text-text-primary">
                  Change Password
                </h2>
                <p className="text-sm text-text-secondary">
                  Ensure your account is using a long, random password to stay
                  secure.
                </p>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-2 max-w-md">
                  <label className="text-sm font-semibold text-text-primary">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-text-secondary" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 max-w-md mt-2">
                  <label className="text-sm font-semibold text-text-primary">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-text-secondary" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 max-w-md">
                  <label className="text-sm font-semibold text-text-primary">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-text-secondary" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="primary">Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
