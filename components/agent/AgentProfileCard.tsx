"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase, CheckCircle, Loader2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  fetchAgentProfile,
  type AgentProfileRow,
} from "@/lib/supabase/agent-dashboard";

export function AgentProfileCard() {
  const [profile, setProfile] = useState<AgentProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAgentProfile()
      .then((p) => {
        if (!cancelled) {
          setProfile(p);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 lg:p-8 flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <Card>
      <CardContent className="p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
          {/* Avatar */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-sm bg-slate-100 flex items-center justify-center">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name ?? "Agent"}
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-10 h-10 sm:w-14 sm:h-14 text-slate-400" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                {profile.full_name ?? "Agent"}
              </h2>
              {profile.is_verified && (
                <Badge variant="success" className="gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>RERA Verified</span>
                </Badge>
              )}
            </div>

            {/* Stats / Info */}
            <div className="flex flex-col gap-2 text-sm text-text-secondary mt-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Briefcase className="w-4 h-4 text-primary shrink-0" />
                <span>{profile.role ?? "Agent"}</span>
              </div>

              {profile.city && (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{profile.city}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </span>
                  <span>{profile.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action */}
          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex shrink-0">
            <Link href="/agent/profile">
              <Button variant="outline" fullWidth className="sm:w-auto">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
