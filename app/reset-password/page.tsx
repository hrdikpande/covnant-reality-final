"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/AuthContext";

export default function ResetPasswordPage() {
    const router = useRouter();
    const { updatePassword, authError, clearError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [localError, setLocalError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setLocalError("");

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setLocalError("Password must be at least 6 characters.");
            return;
        }

        setIsSubmitting(true);

        const { error } = await updatePassword(password);

        setIsSubmitting(false);

        if (!error) {
            setIsSuccess(true);
            // Redirect to login after 2 seconds
            setTimeout(() => router.push("/login"), 2000);
        }
    };

    const displayError = authError || localError;

    return (
        <AuthLayout>
            <section className="flex flex-col gap-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                        Set New Password
                    </h1>
                    <p className="text-sm text-text-secondary">
                        Choose a strong password to secure your account
                    </p>
                </div>

                {/* Error Display */}
                {displayError && (
                    <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.832c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-sm font-medium text-danger">{displayError}</p>
                    </div>
                )}

                {/* Form */}
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {/* Password Section */}
                    <div className="flex flex-col gap-1.5">
                        <Input
                            label="New Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-text-muted hover:text-text-primary transition-colors pr-1"
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        )}
                                    </svg>
                                </button>
                            }
                        />
                    </div>

                    <Input
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                Updating...
                            </span>
                        ) : (
                            "Update Password"
                        )}
                    </Button>
                </form>

                {/* Success Message — shown only after successful update */}
                {isSuccess && (
                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-accent">
                            Password updated successfully. Redirecting...
                        </p>
                    </div>
                )}
            </section>
        </AuthLayout>
    );
}
