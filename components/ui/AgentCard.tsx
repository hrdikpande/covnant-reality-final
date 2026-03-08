"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Agent } from "@/types";

interface AgentCardProps {
    agent: Agent;
    className?: string;
}

export function AgentCard({ agent, className }: AgentCardProps) {
    return (
        <div
            className={cn(
                "group bg-white rounded-3xl border border-border/60 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center",
                className
            )}
        >
            {/* Agent Photo */}
            <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 rounded-full bg-primary/10" />
                <Image
                    src={agent.photo}
                    alt={agent.name}
                    fill
                    className="object-cover rounded-full border-4 border-white shadow-md relative z-10 transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="space-y-3 w-full">
                <div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                        {agent.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 mt-1 text-text-secondary">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{agent.operatingLocation}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 py-3 border-y border-border/50">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-bold text-text-primary">{agent.rating}</span>
                        </div>
                        <span className="text-xs text-text-muted">{agent.reviews} Reviews</span>
                    </div>

                    <div className="w-px h-8 bg-border/50" />

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-primary">
                            <Award className="h-4 w-4" />
                            <span className="font-bold text-text-primary">{agent.experienceYears}y</span>
                        </div>
                        <span className="text-xs text-text-muted">Experience</span>
                    </div>
                </div>

                <div className="pt-2">
                    <Link href={`/search?agent=${agent.id}`}>
                        <Button variant="outline" fullWidth className="text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
                            View Listings
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
