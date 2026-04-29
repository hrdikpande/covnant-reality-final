"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import {
    Heart,
    MapPin,
    BedDouble,
    Bath,
    Scaling,
    ShieldCheck,
    Phone,
    Star
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, formatPropertyTitle } from "@/lib/utils";
import { usePropertyContext } from "@/components/PropertyContext";
import { createLead } from "@/lib/supabase/leads";
import type { Property } from "@/types";

interface PropertyCardProps {
    property: Property;
    className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
    const {
        id,
        title,
        price,
        location,
        city,
        bedrooms,
        bathrooms,
        area,
        image,
        badge,
        verified,
        listed,
    } = property;

    const { savedProperties, toggleSave } = usePropertyContext();
    const isSaved = savedProperties.includes(id);
    const { userRole } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [now, setNow] = useState<number | null>(null);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNow(Date.now());
    }, []);

    // Format price helper
    const formatPrice = (price: number) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        }
        if (price >= 100000) {
            return `₹${(price / 100000).toFixed(1)} L`;
        }
        return `₹${price.toLocaleString("en-IN")}`;
    };

    return (
        <Link
            href={`/property/${id}`}
            className={cn(
                "group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 block",
                className
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={image}
                    alt={formatPropertyTitle(property)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {badge && badge === "new" ? (
                        <Badge variant="default" className="bg-green-100/95 backdrop-blur-sm text-green-700 shadow-sm border border-green-200 uppercase tracking-wide font-bold">
                            NEW
                        </Badge>
                    ) : badge && badge === "rent" ? (
                        <Badge variant="default" className="bg-blue-100/95 backdrop-blur-sm text-blue-700 shadow-sm border border-blue-200 uppercase tracking-wide font-bold">
                            FOR RENT
                        </Badge>
                    ) : badge && badge === "pg" ? (
                        <Badge variant="default" className="bg-purple-100/95 backdrop-blur-sm text-purple-700 shadow-sm border border-purple-200 uppercase tracking-wide font-bold">
                            PG
                        </Badge>
                    ) : badge ? (
                        <Badge variant="default" className="bg-white/90 backdrop-blur-sm text-text-primary shadow-sm border-0 font-semibold">
                            {badge.toUpperCase()}
                        </Badge>
                    ) : null}
                    {verified && (
                        <div className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Verified</span>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <button
                    type="button"
                    title={isSaved ? "Remove from saved" : "Save property"}
                    aria-label={isSaved ? "Remove from saved" : "Save property"}
                    onClick={(e) => {
                        e.preventDefault();
                        if (!userRole) {
                            localStorage.setItem("pendingSaveProperty", id);
                            const searchParams = new URLSearchParams(window.location.search);
                            const qs = searchParams.toString();
                            const currentPath = pathname + (qs ? `?${qs}` : "");
                            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
                        } else {
                            toggleSave(id);
                        }
                    }}
                    className={cn(
                        "absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors shadow-sm",
                        isSaved
                            ? "bg-white text-danger hover:bg-white/90"
                            : "bg-white/90 text-text-secondary hover:text-danger hover:bg-white"
                    )}
                >
                    <Heart className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
                </button>

                {/* Price Tag (Bottom Left of Image) */}
                <div className="absolute bottom-3 left-3">
                    <span className="text-xl font-bold text-white drop-shadow-md">
                        {formatPrice(price)}
                    </span>
                    <div className="text-xs font-medium text-white/90 drop-shadow-md mt-0.5">
                        {property.pricePerSqFt ? `₹ ${property.pricePerSqFt.toLocaleString("en-IN")} / sq ft` : "N/A"}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Title & Location */}
                <div>
                    <h3 className="text-base font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors capitalize">
                        {formatPropertyTitle(property)}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-text-secondary">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-xs truncate">
                            {location}, {city}
                        </span>
                    </div>

                    {/* Ratings */}
                    {property.rating ? (
                        <div className="flex items-center gap-1 mt-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-semibold text-text-primary">
                                {property.rating.toFixed(1)}
                            </span>
                            <span className="text-[10px] text-text-muted">
                                ({property.reviewCount} review{property.reviewCount !== 1 ? 's' : ''})
                            </span>
                        </div>
                    ) : null}

                    {/* Posted Time */}
                    {listed && now !== null && (
                        <div className="text-[10px] text-text-muted mt-1.5 font-medium">
                            Added {
                                (() => {
                                    const diff = now - new Date(listed).getTime();
                                    const hours = Math.floor(diff / (1000 * 60 * 60));
                                    const days = Math.floor(hours / 24);
                                    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
                                    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
                                    return 'Just now';
                                })()
                            }
                        </div>
                    )}
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-border/50">
                    <div className="flex flex-col items-center justify-center gap-1">
                        <BedDouble className="h-4 w-4 text-text-muted" />
                        <span className="text-xs font-medium text-text-secondary">{bedrooms} Beds</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 border-l border-border/50">
                        <Bath className="h-4 w-4 text-text-muted" />
                        <span className="text-xs font-medium text-text-secondary">{bathrooms} Baths</span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 border-l border-border/50">
                        <Scaling className="h-4 w-4 text-text-muted" />
                        <span className="text-xs font-medium text-text-secondary">{area} sqft</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" fullWidth className="text-xs">
                        Details
                    </Button>
                    <Button
                        size="sm"
                        fullWidth
                        className="gap-1.5 text-xs"
                        onClick={(e) => {
                            e.preventDefault();
                            // Fire-and-forget: create lead in background while redirecting
                            createLead({
                                propertyId: id,
                                name: "Contact Request",
                                phone: "",
                                source: "Call",
                            }).catch(() => { /* best-effort */ });
                            const dialNumber = property.contactNumber || "1234567890";
                            window.location.href = `tel:${dialNumber}`;
                        }}
                    >
                        <Phone className="h-3.5 w-3.5" />
                        Contact
                    </Button>
                </div>
            </div>
        </Link>
    );
}
