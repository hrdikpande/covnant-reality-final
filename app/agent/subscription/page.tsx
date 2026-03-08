import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, Zap, ShieldCheck, HeartHandshake } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default async function AgentSubscriptionPage() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
        redirect("/auth");
    }

    const benefits = [
        "Unlimited Property Listings",
        "Full CRM Access & Lead Management",
        "Performance Analytics & Reports",
        "Site Visit Scheduling",
        "Priority Email Support",
        "Dedicated Account Manager",
    ];

    return (
        <div className="flex flex-col gap-8 md:gap-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2 max-w-2xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                    Subscription Center
                </h1>
                <p className="text-sm sm:text-base text-text-secondary">
                    Manage your billing and plan details. Good news—all features are currently unlocked for you!
                </p>
            </div>

            {/* Main Plan Card */}
            <section className="flex justify-center">
                <Card className="w-full max-w-4xl border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Zap className="w-48 h-48 text-primary" />
                    </div>

                    <CardHeader className="text-center pb-8 border-b border-border/50 bg-white/50 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 mx-auto">
                            <ShieldCheck className="w-4 h-4" />
                            Lifetime Founder Access
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-text-primary mb-4 flex items-center justify-center gap-2">
                            ₹0 <span className="text-xl sm:text-2xl text-text-secondary font-medium">/ month</span>
                        </h2>
                        <p className="text-base sm:text-lg text-text-secondary max-w-lg mx-auto">
                            As an early adopter, you get 100% free access to all premium Covnant Reality tools. Welcome to the family!
                        </p>
                    </CardHeader>

                    <CardContent className="p-6 sm:p-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 x-auto max-w-3xl mx-auto">
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-text-primary text-lg flex items-center gap-2">
                                    <HeartHandshake className="text-primary w-5 h-5" />
                                    Everything is Included:
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {benefits.slice(0, 3).map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="mt-0.5 shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <span className="text-text-secondary font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 pt-10 md:pt-11">
                                <div className="flex flex-col gap-3">
                                    {benefits.slice(3).map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="mt-0.5 shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <span className="text-text-secondary font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 max-w-md mx-auto">
                            <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm" disabled>
                                Current Active Plan
                            </button>
                            <p className="text-center text-xs text-text-secondary mt-4">
                                No credit card required. Your plan will not automatically renew to a paid tier without your explicit consent.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
