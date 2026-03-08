"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthModal } from "@/components/ui/AuthModal";
import { Button } from "@/components/ui/Button";
import { Lock, ArrowRight } from "lucide-react";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const [isAuthenticated] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 sm:px-6">
            <div className="flex flex-col items-center gap-5 max-w-sm text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-text-muted" aria-hidden="true">
                    <Lock className="w-8 h-8" />
                </div>

                {/* Heading */}
                <h2 className="text-2xl lg:text-3xl font-bold text-text-primary">
                    Authentication Required
                </h2>

                {/* Message */}
                <p className="text-sm text-text-secondary leading-relaxed">
                    You must login to access this page. Please sign in or create an account to continue.
                </p>

                {/* Actions */}
                <div className="w-full flex flex-col gap-3 mt-4">
                    <Button
                        type="button"
                        size="lg"
                        fullWidth
                        onClick={() => setIsAuthModalOpen(true)}
                    >
                        Login
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <p className="text-sm text-text-secondary">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-primary hover:text-primary-hover transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView="login"
            />
        </div>
    );
}
