import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const HIGHLIGHTS = [
    "Verified Listings",
    "Trusted Agents",
    "Secure Transactions",
];

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">

            {/* ── Left Marketing Panel (Desktop only) ──────────────── */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("/auth-bg.png")' }}
                />
                <div className="absolute inset-0 z-0 bg-slate-900/40" />

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
                    <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                        Premium Spaces
                        <br />
                        Tailored for You
                    </h2>

                    <p className="mt-4 text-blue-50 text-lg max-w-md drop-shadow-md">
                        Your trusted marketplace for premium real estate.
                    </p>

                    <ul className="mt-8 flex flex-col gap-3">
                        {HIGHLIGHTS.map((text) => (
                            <li key={text} className="flex items-center gap-3 text-white/90">
                                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                                <span className="text-base font-medium">{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ── Right Auth Panel ──────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8">
                <div className="w-full max-w-[420px] md:max-w-[460px] flex flex-col items-center gap-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center justify-center mb-2">
                        <Image
                            src="/logo.png"
                            alt="Covnant Reality Logo"
                            width={200}
                            height={64}
                            className="h-16 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Auth Card */}
                    <Card className="w-full shadow-sm lg:shadow-lg">
                        <CardContent className="px-5 py-6 sm:px-8 sm:py-8">
                            {children}
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <p className="text-xs text-text-muted text-center">
                        © 2025 Covnant Reality India PVT LTD. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
