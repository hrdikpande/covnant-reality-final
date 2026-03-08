"use client";

import { MapPin, User, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LocationSelector } from "@/components/ui/LocationSelector";
import { useAuth, UserRole } from "@/components/AuthContext";
import { useLocation } from "@/components/LocationContext";

export function Header() {
    const { selectedLocation, setLocation, isLocationSelectorOpen, openLocationSelector, closeLocationSelector } = useLocation();
    const { userRole, signOut } = useAuth();
    const canPostProperty = userRole !== "buyer" && userRole !== "tenant";

    const getDashboardPath = (role: UserRole) => {
        if (role === "agent") return "/agent";
        if (role === "builder") return "/builder";
        if (role === "admin") return "/admin";
        if (role === "owner") return "/owner";
        return "/dashboard";
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center gap-8 lg:gap-10">
                        <Link href="/" className="flex items-center group">
                            <Image
                                src="/logo.png"
                                alt="Covnant Reality Logo"
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-6">
                            <div className="flex items-center gap-6">
                                <Link href="/search?type=buy" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Buy</Link>
                                <Link href="/search?type=rent" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Rent</Link>
                                {canPostProperty && <Link href={userRole ? "/post-property" : "/login?redirect=/post-property"} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Sell</Link>}
                            </div>

                            <div className="h-4 w-px bg-border mx-2" />

                            <div className="flex items-center gap-6">
                                <Link href="/search?category=residential" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Residential</Link>
                                <Link href="/search?category=commercial" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Commercial</Link>
                            </div>
                        </nav>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-3">
                        {canPostProperty && (
                            <Link href={userRole ? "/post-property" : "/login?redirect=/post-property"} className="hidden lg:flex items-center justify-center h-9 px-4 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">
                                Post Property
                            </Link>
                        )}

                        {/* Location Selector */}
                        <button
                            type="button"
                            onClick={openLocationSelector}
                            aria-label="Select location"
                            className="flex items-center gap-1.5 h-10 px-3 rounded-full text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
                        >
                            <MapPin className="h-4 w-4 text-primary shrink-0" />
                            <span className="hidden xs:inline sm:inline max-w-[80px] sm:max-w-[150px] truncate">
                                {selectedLocation.locality?.name || selectedLocation.city?.name || "Location"}
                            </span>
                            <svg
                                className="h-3 w-3 text-text-muted shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {userRole ? (
                            <>
                                {/* Dashboard Button (Only on large screens where BottomNav is hidden) */}
                                <Link
                                    href={getDashboardPath(userRole)}
                                    className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-slate-100 transition-colors"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>

                                {/* Logout Button (Desktop/Tablet) */}
                                <button
                                    onClick={signOut}
                                    className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border text-sm font-medium text-danger hover:bg-danger/5 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden md:inline">Logout</span>
                                </button>

                                {/* Profile / Dashboard (Mobile fallback) */}
                                <Link
                                    href={getDashboardPath(userRole)}
                                    className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full text-white bg-primary shadow-md hover:bg-primary-hover transition-all"
                                    aria-label="User dashboard"
                                >
                                    <User className="h-5 w-5" />
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Login */}
                                <Link
                                    href="/login"
                                    className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-slate-100 transition-colors"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Login</span>
                                </Link>

                                {/* Signup */}
                                <Link
                                    href="/signup"
                                    className="hidden md:flex items-center justify-center h-9 px-4 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                                >
                                    Sign Up
                                </Link>

                                {/* Profile (mobile fallback for login/signup) */}
                                <Link
                                    href="/login"
                                    className="sm:hidden flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
                                    aria-label="User profile"
                                >
                                    <User className="h-5 w-5" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Location Selector Drawer */}
            <LocationSelector
                isOpen={isLocationSelectorOpen}
                selectedLocation={selectedLocation}
                onSelect={setLocation}
                onClose={closeLocationSelector}
            />
        </>
    );
}
