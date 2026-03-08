"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { User, Home, Building2, HardHat } from "lucide-react";
import { useAuth, UserRole, getDashboardPath } from "@/components/AuthContext";
import { usePropertyContext } from "@/components/PropertyContext";

type Role = "buyer" | "tenant" | "agent" | "builder" | "owner";

interface RoleCardProps {
    id: Role;
    title: string;
    description: string;
    icon: React.ReactNode;
    selected: boolean;
    onClick: () => void;
}

function RoleCard({ title, description, icon, selected, onClick }: RoleCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "w-full flex items-start p-4 rounded-xl border-2 text-left transition-all duration-200",
                selected
                    ? "border-primary bg-primary-light/30"
                    : "border-border bg-white hover:border-primary/50 hover:bg-slate-50"
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg shrink-0 mr-4 transition-colors",
                    selected ? "bg-primary text-white" : "bg-slate-100 text-text-secondary"
                )}
            >
                {icon}
            </div>
            <div className="flex-1">
                <h3
                    className={cn(
                        "text-sm font-semibold transition-colors",
                        selected ? "text-primary" : "text-text-primary"
                    )}
                >
                    {title}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                    {description}
                </p>
            </div>
            {/* Radio / Selection Indicator */}
            <div
                className={cn(
                    "flex flex-col items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 transition-colors ml-2",
                    selected
                        ? "border-primary bg-primary"
                        : "border-border bg-transparent"
                )}
            >
                {selected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                )}
            </div>
        </button>
    );
}

export default function SignupPage() {
    const router = useRouter();
    const { signUp, authError, clearError } = useAuth();
    const { savedProperties, toggleSave } = usePropertyContext();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedRole, setSelectedRole] = useState<UserRole>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Form fields
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [experience, setExperience] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Dynamic checks
    const isProRole = selectedRole === "agent" || selectedRole === "builder" || selectedRole === "owner";

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setPasswordError("");

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error, role } = await signUp(email, password, {
                full_name: fullName,
                phone,
                role: selectedRole as string,
                company,
                experience,
            });

            if (!error) {
                // Process pending save if exists
                const pendingSave = localStorage.getItem("pendingSaveProperty");
                if (pendingSave) {
                    if (!savedProperties.includes(pendingSave)) {
                        toggleSave(pendingSave);
                    }
                    localStorage.removeItem("pendingSaveProperty");
                }

                const searchParams = new URLSearchParams(window.location.search);
                const redirectPath = searchParams.get("redirect");

                if (redirectPath && redirectPath.startsWith('/')) {
                    router.push(redirectPath);
                } else {
                    router.push(getDashboardPath(role ?? selectedRole));
                }
            }
        } catch (err) {
            console.error("Signup error:", err);
            setPasswordError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };





    return (
        <AuthLayout>
            <section className="flex flex-col gap-6 w-full">
                {/* Step Indicator */}
                <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                        Step {step} of 2
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                        className="h-1.5 bg-primary rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${(step / 2) * 100}%` }}
                    />
                </div>

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-sm text-text-secondary">
                        {step === 1 && "Select your role to continue"}
                        {step === 2 && "Enter your details to register"}
                    </p>
                </div>

                {/* Error Display */}
                {(authError || passwordError) && (
                    <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.832c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-sm font-medium text-danger">
                            {authError || passwordError}
                        </p>
                    </div>
                )}

                {/* ── Step 1: Role Selection ── */}
                {step === 1 && (
                    <>
                        <div className="flex flex-col gap-3 mt-2">
                            <RoleCard
                                id="buyer"
                                title="Buyer"
                                description="Search and connect with sellers"
                                icon={<User className="w-5 h-5" />}
                                selected={selectedRole === "buyer"}
                                onClick={() => setSelectedRole("buyer")}
                            />
                            <RoleCard
                                id="tenant"
                                title="Tenant"
                                description="Find rental properties"
                                icon={<Home className="w-5 h-5" />}
                                selected={selectedRole === "tenant"}
                                onClick={() => setSelectedRole("tenant")}
                            />
                            <RoleCard
                                id="agent"
                                title="Agent"
                                description="Manage listings and leads"
                                icon={<Building2 className="w-5 h-5" />}
                                selected={selectedRole === "agent"}
                                onClick={() => setSelectedRole("agent")}
                            />
                            <RoleCard
                                id="builder"
                                title="Builder"
                                description="Promote projects and units"
                                icon={<HardHat className="w-5 h-5" />}
                                selected={selectedRole === "builder"}
                                onClick={() => setSelectedRole("builder")}
                            />
                            <RoleCard
                                id="owner"
                                title="Property Owner"
                                description="List and manage your own properties"
                                icon={<Home className="w-5 h-5" />} // Reuse Home icon or import a custom one
                                selected={selectedRole === "owner"}
                                onClick={() => setSelectedRole("owner")}
                            />
                        </div>

                        <div className="mt-4 flex flex-col gap-4">
                            <Button
                                type="button"
                                fullWidth
                                size="lg"
                                disabled={!selectedRole}
                                onClick={() => setStep(2)}
                            >
                                Continue
                            </Button>

                            <p className="text-sm text-text-secondary text-center">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-medium text-primary hover:text-primary-hover transition-colors"
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </>
                )}

                {/* ── Step 2: Details Form ── */}
                {step === 2 && (
                    <form
                        className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300"
                        onSubmit={handleSignup}
                    >
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="Enter your full name"
                                autoComplete="name"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                label="Mobile Number"
                                type="tel"
                                placeholder="000 000 0000"
                                autoComplete="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                leftIcon={<span className="text-sm text-text-primary px-1 font-medium">+91</span>}
                            />

                            {/* Dynamic Fields for Pro Roles */}
                            {isProRole && (
                                <>
                                    <Input
                                        label="Company/Agency Name"
                                        type="text"
                                        placeholder="Enter company name"
                                        autoComplete="organization"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                    />
                                    <Input
                                        label="Experience (in years)"
                                        type="number"
                                        placeholder="e.g. 5"
                                        min={0}
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                    />
                                </>
                            )}

                            {/* Password Section */}
                            <div className="flex flex-col gap-1.5">
                                <Input
                                    label="Password"
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
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center gap-3 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-1/3 h-12"
                                onClick={() => {
                                    clearError();
                                    setPasswordError("");
                                    setStep(1);
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-12"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating account...
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </section>
        </AuthLayout>
    );
}
