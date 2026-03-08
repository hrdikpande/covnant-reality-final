import { ShieldCheck, Building2, Lock, Sparkles } from "lucide-react";

const features = [
    {
        title: "Verified Agents",
        description: "Trusted network of professionals",
        icon: ShieldCheck,
    },
    {
        title: "RERA Registered",
        description: "100% compliant projects",
        icon: Building2,
    },
    {
        title: "Secure Transactions",
        description: "Safe & transparent process",
        icon: Lock,
    },
    {
        title: "Smart Search",
        description: "AI-powered property match",
        icon: Sparkles,
    },
];

export function TrustSection() {
    return (
        <section className="py-12 lg:py-20 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
                        Why Choose Us
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
                        We build trust through transparency, security, and smart technology
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white p-4 sm:p-6 rounded-2xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-1 hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col items-center text-center group h-full"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-emerald-100 transition-colors duration-300">
                                    <Icon className="w-6 h-6 sm:w-6 sm:h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-text-secondary line-clamp-1">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
