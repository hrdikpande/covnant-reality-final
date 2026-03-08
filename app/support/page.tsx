import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, Info, Mail, Shield, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Support Center | Covnant Reality India PVT LTD',
    description: 'Find help, support, and legal information for Covnant Reality India PVT LTD.',
};

export default function SupportPage() {
    const supportLinks = [
        {
            title: "About Us",
            description: "Learn more about our vision, mission, and the team behind Covnant.",
            icon: <Info className="w-8 h-8 text-primary" />,
            href: "/about"
        },
        {
            title: "Contact Us",
            description: "Get in touch with our team for any inquiries or assistance.",
            icon: <Mail className="w-8 h-8 text-primary" />,
            href: "/contact"
        },
        {
            title: "FAQs",
            description: "Find quick answers to commonly asked questions about our platform.",
            icon: <HelpCircle className="w-8 h-8 text-primary" />,
            href: "/faq"
        },
        {
            title: "Privacy Policy",
            description: "Understand how we collect, use, and protect your personal information.",
            icon: <Shield className="w-8 h-8 text-primary" />,
            href: "/privacy"
        },
        {
            title: "Terms of Service",
            description: "Read the rules, guidelines, and agreements for using our services.",
            icon: <FileText className="w-8 h-8 text-primary" />,
            href: "/terms"
        }
    ];

    return (
        <div className="min-h-screen bg-bg">
            <div className="bg-primary py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Support Center</h1>
                    <p className="text-xl text-primary-light max-w-2xl mx-auto">
                        How can we help you today? Browse our support resources below or get in touch with our team.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {supportLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="bg-white rounded-2xl shadow-card border border-border p-8 hover:border-primary/50 hover:shadow-hover transition-all duration-300 group flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {link.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                                {link.title}
                            </h2>
                            <p className="text-text-secondary">
                                {link.description}
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="mt-20 bg-white rounded-3xl p-8 md:p-12 border border-border text-center max-w-4xl mx-auto shadow-sm">
                    <h2 className="text-3xl font-bold text-text-primary mb-4">Can&apos;t find what you&apos;re looking for?</h2>
                    <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                        Our dedicated support team is available from Monday to Friday, 9:00 AM to 6:00 PM IST to assist you with any questions or concerns.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm hover:shadow"
                    >
                        Contact Support Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
