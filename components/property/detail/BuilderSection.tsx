"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, Award, FolderKanban, User } from "lucide-react";
import { fetchOwnerProfile } from "@/lib/supabase/homepage";
import type { Property } from "@/types";

interface BuilderSectionProps {
    property: Property;
}

export function BuilderSection({ property }: BuilderSectionProps) {
    const [owner, setOwner] = useState<{ name: string; avatar: string; role: string } | null>(null);

    useEffect(() => {
        if (!property.ownerId) return;
        fetchOwnerProfile(property.ownerId).then(setOwner);
    }, [property.ownerId]);

    if (!owner) return null;

    const roleLabel = owner.role === "builder"
        ? "Builder"
        : owner.role === "agent"
            ? "Agent"
            : "Owner";

    return (
        <section className="py-6 border-b border-border bg-bg-card">
            <h3 className="text-lg font-bold text-text-primary mb-4">
                About {roleLabel}
            </h3>

            <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full border border-border bg-bg shadow-sm flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {owner.avatar ? (
                            <Image
                                src={owner.avatar}
                                alt={owner.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <User className="w-8 h-8 text-text-muted" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-text-primary text-base mb-0.5">{owner.name}</h4>
                        <p className="text-sm text-text-muted capitalize">{roleLabel} on Covnant Reality India PVT LTD</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-primary-light/50 rounded-xl p-3 border border-primary-light/50 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 mb-1 text-primary font-medium">
                            <Award className="w-4 h-4" />
                            <span className="text-xs">Role</span>
                        </div>
                        <p className="text-sm font-bold text-text-primary capitalize">{owner.role}</p>
                    </div>

                    <div className="bg-accent/10 rounded-xl p-3 border border-accent/20 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 mb-1 text-accent font-medium">
                            <FolderKanban className="w-4 h-4" />
                            <span className="text-xs">Platform</span>
                        </div>
                        <p className="text-sm font-bold text-text-primary">Verified</p>
                    </div>
                </div>

                <button className="w-full py-2.5 flex items-center justify-center gap-2 bg-bg text-text-primary font-medium rounded-xl text-sm border border-border hover:bg-bg-card transition-colors">
                    View Profile
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}
