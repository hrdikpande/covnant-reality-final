"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Check, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Constants ── */

const STEPS = [
    { label: "Identity", description: "Government IDs" },
    { label: "Business Details", description: "Your operations" },
    { label: "Documents", description: "Upload files" },
];

/* ── Sub-components (declared outside render) ── */

function UploadBox({ label, hint }: { label: string; hint: string }) {
    return (
        <label className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-text-muted group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-text-primary">{label}</p>
                <p className="text-xs text-text-muted mt-1">{hint}</p>
                <p className="text-xs text-primary/60 mt-1.5 font-medium">Click to upload or drag and drop</p>
            </div>
            <input type="file" className="hidden" disabled />
        </label>
    );
}

function HorizontalStepIndicator({ step }: { step: number }) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-border">
            <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0" />
                <div
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-300 ease-in-out"
                    style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                />
                {STEPS.map((s, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < step;
                    const isActive = stepNumber === step;

                    return (
                        <div key={s.label} className="relative z-10 flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300",
                                    isCompleted ? "bg-primary text-white" :
                                        isActive ? "bg-primary text-white shadow-md ring-4 ring-primary/20" :
                                            "bg-white border-2 border-slate-200 text-text-muted"
                                )}
                            >
                                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] sm:text-xs font-medium hidden sm:block",
                                    isActive ? "text-primary" : "text-text-muted"
                                )}
                            >
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function VerticalStepIndicator({ step, onStepClick }: { step: number; onStepClick: (s: 1 | 2 | 3) => void }) {
    return (
        <nav aria-label="KYC verification steps" className="flex flex-col gap-1">
            {STEPS.map((s, index) => {
                const stepNumber = (index + 1) as 1 | 2 | 3;
                const isCompleted = stepNumber < step;
                const isActive = stepNumber === step;

                return (
                    <button
                        key={s.label}
                        type="button"
                        onClick={() => onStepClick(stepNumber)}
                        className={cn(
                            "flex items-center gap-4 p-3 rounded-xl text-left transition-colors duration-200",
                            isActive && "bg-primary/5 border border-primary/20",
                            !isActive && "hover:bg-slate-50"
                        )}
                    >
                        <div
                            className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors duration-300",
                                isCompleted ? "bg-primary text-white" :
                                    isActive ? "bg-primary text-white ring-4 ring-primary/20" :
                                        "bg-slate-100 border border-slate-200 text-text-muted"
                            )}
                        >
                            {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                        </div>
                        <div>
                            <p className={cn(
                                "text-sm font-medium",
                                isActive ? "text-primary" : "text-text-primary"
                            )}>
                                {s.label}
                            </p>
                            <p className="text-xs text-text-muted">{s.description}</p>
                        </div>
                    </button>
                );
            })}
        </nav>
    );
}

/* ── Main Page ── */

export default function KycVerificationPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [mockCities, setMockCities] = useState(["Mumbai", "Pune"]);

    const handleRemoveCity = (cityToRemove: string) => {
        setMockCities(mockCities.filter((c) => c !== cityToRemove));
    };

    /* ── Shared Form Content JSX ── */
    const formContent = (
        <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm lg:shadow-md border border-border transition-all duration-300">
            <form className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {step === 1 && (
                    <>
                        <div className="mb-2">
                            <h2 className="text-xl font-semibold text-text-primary">Identity Information</h2>
                            <p className="text-sm text-text-secondary mt-1">Enter your government issued IDs.</p>
                        </div>
                        <div className="flex flex-col gap-5">
                            <Input label="PAN Number" placeholder="e.g. ABCDE1234F" autoComplete="off" required />
                            <Input label="Aadhaar Number" placeholder="12-digit format" autoComplete="off" required />
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="mb-2">
                            <h2 className="text-xl font-semibold text-text-primary">Business Details</h2>
                            <p className="text-sm text-text-secondary mt-1">Tell us about your operations.</p>
                        </div>
                        <div className="flex flex-col gap-5">
                            <Input label="Office Address" placeholder="Full business address" required />

                            {/* Mock Multi-select Cities */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-text-primary">
                                    Operating Cities <span className="text-danger">*</span>
                                </label>
                                <div className="min-h-[40px] px-3 py-2 bg-white border border-border rounded-xl flex items-center flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-border-focus transition-all">
                                    {mockCities.map((city) => (
                                        <div key={city} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                                            {city}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCity(city)}
                                                className="hover:bg-primary/20 rounded-full p-0.5 ml-0.5 transition-colors"
                                                aria-label={`Remove ${city}`}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <input
                                        type="text"
                                        placeholder={mockCities.length === 0 ? "Search and add cities..." : "Add more..."}
                                        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent placeholder:text-text-muted"
                                        aria-label="Search cities"
                                    />
                                </div>
                            </div>

                            <Input label="Years of Experience" type="number" placeholder="e.g. 5" min={0} />
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="mb-2">
                            <h2 className="text-xl font-semibold text-text-primary">Document Upload</h2>
                            <p className="text-sm text-text-secondary mt-1">Upload clear scans of required documents.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                            <UploadBox label="PAN Document" hint="JPG, PNG or PDF" />
                            <UploadBox label="Aadhaar" hint="JPG, PNG or PDF" />
                            <UploadBox label="RERA Certificate" hint="Required for Agents" />
                        </div>
                    </>
                )}

                <div className="h-px bg-border w-full mt-2" />

                {/* Navigation Actions */}
                <div className="flex items-center justify-between gap-4 mt-2">
                    {step > 1 ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                            className="w-1/3 sm:w-1/4"
                        >
                            Back
                        </Button>
                    ) : (
                        <div className="w-1/3 sm:w-1/4" />
                    )}

                    {step < 3 ? (
                        <Button
                            type="button"
                            onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                            className="w-2/3 sm:w-1/3"
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            className="w-2/3 sm:w-1/2"
                            onClick={() => router.push("/dashboard")}
                        >
                            Submit for Verification
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-120px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-5xl mx-auto mb-8 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary text-balance">
                    Complete Your Verification
                </h1>
                <p className="mt-2 text-sm text-text-secondary">
                    Please provide your details and documents to get a &quot;Verified&quot; badge.
                </p>
            </div>

            {/* ── Mobile/Tablet: stacked layout ── */}
            <div className="max-w-2xl mx-auto flex flex-col gap-6 lg:hidden">
                <HorizontalStepIndicator step={step} />
                {formContent}
            </div>

            {/* ── Desktop: 2-column layout ── */}
            <div className="hidden lg:grid lg:grid-cols-[280px_1fr] max-w-5xl mx-auto gap-8">
                {/* Left: Vertical step nav (sticky) */}
                <aside className="sticky top-24 self-start">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-border">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">Verification Steps</h3>
                        <VerticalStepIndicator step={step} onStepClick={setStep} />
                    </div>
                </aside>

                {/* Right: Form content */}
                {formContent}
            </div>
        </div>
    );
}
