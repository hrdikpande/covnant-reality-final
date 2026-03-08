"use client";

import {
    CreditCard,
    BadgeCheck,
    Gift,
    Info,
    Users,
    Building2,
    Target,
    BarChart3,
    Sparkles,
} from "lucide-react";

const FREE_FEATURES = [
    {
        icon: Users,
        title: "User Registration",
        description: "All user sign-ups are completely free with no limits.",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Building2,
        title: "Property Listings",
        description: "Agents, builders, and owners can list unlimited properties at no cost.",
        color: "text-green-600",
        bg: "bg-green-50",
    },
    {
        icon: Target,
        title: "Lead Management",
        description: "Lead generation and tracking is free for all users.",
        color: "text-purple-600",
        bg: "bg-purple-50",
    },
    {
        icon: BarChart3,
        title: "Analytics & Insights",
        description: "Platform analytics and performance dashboards are included free.",
        color: "text-amber-600",
        bg: "bg-amber-50",
    },
    {
        icon: BadgeCheck,
        title: "Verification & KYC",
        description: "Agent and builder verification is offered at no charge.",
        color: "text-teal-600",
        bg: "bg-teal-50",
    },
    {
        icon: Sparkles,
        title: "Featured Listings",
        description: "Property boosting and featured placements are currently free.",
        color: "text-rose-600",
        bg: "bg-rose-50",
    },
];

export default function PaymentsPage() {
    return (
        <div className="w-full flex-1 p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Payments & Billing</h1>
                <p className="text-sm text-text-muted mt-1">
                    Manage platform pricing, subscriptions, and billing information.
                </p>
            </div>

            {/* Free Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative flex flex-col items-center text-center">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-primary/10 mb-5">
                        <Gift className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                        Everything is Free
                    </h2>
                    <p className="text-text-muted text-sm md:text-base max-w-lg leading-relaxed">
                        All platform features are currently available at no cost to users. There are
                        no active subscriptions, billing cycles, or payment processing at this time.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-primary/10 rounded-full text-sm text-primary font-semibold shadow-sm">
                        <CreditCard className="w-4 h-4" />
                        ₹0.00 / month — No charges
                    </div>
                </div>
            </div>

            {/* Info Alert */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold">No payment gateway is currently integrated.</p>
                    <p className="text-blue-700 mt-1">
                        When you decide to monetize the platform, this section will include
                        subscription plan management, transaction history, invoice generation,
                        and payment gateway integration (e.g., Razorpay, Stripe).
                    </p>
                </div>
            </div>

            {/* Free Features Grid */}
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                    What&apos;s included for free
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FREE_FEATURES.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2.5 rounded-xl ${feature.bg} shrink-0 transition-transform group-hover:scale-110`}>
                                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-text-primary text-sm mb-1">
                                        {feature.title}
                                    </h4>
                                    <p className="text-text-muted text-xs leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Revenue Summary Placeholder */}
            <div className="bg-white border border-border rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Revenue Summary</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Revenue", value: "₹0" },
                        { label: "Active Subscriptions", value: "0" },
                        { label: "Pending Payouts", value: "₹0" },
                        { label: "Transactions", value: "0" },
                    ].map((metric) => (
                        <div
                            key={metric.label}
                            className="bg-slate-50 rounded-lg p-4 border border-slate-100"
                        >
                            <span className="text-xs text-text-muted font-medium block mb-1">
                                {metric.label}
                            </span>
                            <span className="text-xl font-bold text-text-primary">
                                {metric.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
