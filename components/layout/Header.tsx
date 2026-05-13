"use client";

import { MapPin, User, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LocationSelector } from "@/components/ui/LocationSelector";
import { useAuth, UserRole } from "@/components/AuthContext";
import { useLocation } from "@/components/LocationContext";
import { cn } from "@/lib/utils";

export function Header() {
    const { selectedLocation, setLocation, isLocationSelectorOpen, openLocationSelector, closeLocationSelector } = useLocation();
    const { userRole } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getDashboardPath = (role: UserRole) => {
        if (role === "agent") return "/agent";
        if (role === "builder") return "/builder";
        if (role === "admin") return "/admin";
        if (role === "owner") return "/owner";
        return "/dashboard";
    };

    const navLinks = [
        { href: "/search?type=buy", label: "Buy" },
        { href: "/search?type=rent", label: "Rent" },
        { href: "/search?category=residential", label: "Residential" },
        { href: "/search?category=commercial", label: "Commercial" },
        { href: "/blog", label: "Blog" },
    ];

    return (
        <>
            <header className="sticky top-0 z-[90] bg-white shadow-sm border-b border-slate-100">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center gap-8 lg:gap-10">
                        <Link href="/" className="flex items-center group">
                            <Image
                                src="/logo.png"
                                alt="Covnant Reality Logo"
                                width={144}
                                height={48}
                                className="object-contain transition-transform group-hover:scale-105"
                                style={{ height: '3rem', width: 'auto' }}
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-6">
                            <div className="flex items-center gap-6">
                                <Link href="/search?type=buy" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Buy</Link>
                                <Link href="/search?type=rent" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Rent</Link>
                            </div>

                            <div className="h-4 w-px bg-border mx-2" />

                            <div className="flex items-center gap-6">
                                <Link href="/search?category=residential" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Residential</Link>
                                <Link href="/search?category=commercial" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Commercial</Link>
                                <Link href="/blog" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Blog</Link>
                            </div>
                        </nav>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-3">
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
                            <Link
                                href={getDashboardPath(userRole)}
                                className="flex items-center justify-center h-10 w-10 rounded-full text-white bg-primary shadow-md hover:bg-primary-hover transition-all"
                                aria-label="User dashboard"
                            >
                                <User className="h-5 w-5" />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
                                aria-label="User profile"
                            >
                                <User className="h-5 w-5" />
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={cn(
                    "lg:hidden fixed inset-0 z-[100] bg-white transition-transform duration-300 ease-in-out",
                    isMobileMenuOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
                )}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
                            <Image
                                src="/logo.png"
                                alt="Covnant Reality Logo"
                                width={120}
                                height={40}
                                className="object-contain"
                            />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-slate-500 hover:text-primary transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto py-6 px-4">
                            <div className="space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center px-4 py-4 text-lg font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </nav>
                        <div className="p-4 border-t border-slate-100">
                            <p className="text-center text-sm text-slate-500 mb-4">
                                Need help? Call us at +91 99999 99999
                            </p>
                            <Link
                                href="/contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-center w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>
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
