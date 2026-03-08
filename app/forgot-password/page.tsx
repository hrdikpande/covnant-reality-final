"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/AuthContext";

export default function ForgotPasswordPage() {
    const { resetPassword, authError, clearError } = useAuth();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setIsSubmitting(true);

        const { error } = await resetPassword(email);

        setIsSubmitting(false);
        if (!error) {
            setIsSent(true);
        }
    };

    return (
        <AuthLayout>
            <section className="flex flex-col gap-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Enter your email to receive reset instructions
                    </p>
                </div>

                {/* Error Display */}
                {authError && (
                    <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.832c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-sm font-medium text-danger">{authError}</p>
                    </div>
                )}

                {/* Form */}
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        className="h-12 text-base mt-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending...
                            </span>
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
                </form>

                {/* Success Message — shown only after successful send */}
                {isSent && (
                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-accent">
                            Reset link sent to <strong>{email}</strong>. Check your inbox.
                        </p>
                    </div>
                )}

                {/* Footer Link */}
                <div className="text-center mt-2">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Login
                    </Link>
                </div>
            </section>
        </AuthLayout>
    );
}
