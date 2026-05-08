"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-white border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="Covnant Reality - Real Estate Company in Hyderabad"
                                width={180}
                                height={60}
                                className="object-contain"
                                style={{ height: '3.5rem', width: 'auto' }}
                            />
                        </Link>
                        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                            Hyderabad&apos;s trusted real estate company for commercial property,
                            residential properties, warehouses, and plots. Find your perfect
                            property with Covnant Reality.
                        </p>
                    </div>

                    {/* Property Types — SEO Landing Pages */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Property Types</h3>
                        <ul className="space-y-3">
                            <li><Link href="/commercial-property-hyderabad" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Commercial Property in Hyderabad</Link></li>
                            <li><Link href="/residential-properties-hyderabad" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Residential Properties in Hyderabad</Link></li>
                            <li><Link href="/warehouse-hyderabad" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Warehouse in Hyderabad</Link></li>
                            <li><Link href="/plots-land-hyderabad" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Plots &amp; Land in Hyderabad</Link></li>
                            <li><Link href="/property-management-hyderabad" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Property Management</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link href="/search?type=buy" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Buy Property</Link></li>
                            <li><Link href="/search?type=rent" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Rent Property</Link></li>
                            <li><Link href="/search?type=commercial" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Commercial Spaces</Link></li>
                            <li><Link href="/search?type=project" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">New Projects</Link></li>
                            <li><Link href="/blog" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Blog &amp; Insights</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">Support</h3>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">About Us</Link></li>
                            <li><Link href="/contact" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Contact Us</Link></li>
                            <li><Link href="/faq" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">FAQs</Link></li>
                            <li><Link href="/privacy" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-sm text-text-secondary hover:text-primary transition-colors inline-block">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-sm text-text-muted">
                        &copy; {new Date().getFullYear()} Covnant Reality India PVT LTD. All rights reserved.
                    </p>
                    <p className="text-xs text-text-muted">
                        Commercial Property &middot; Residential Properties &middot; Warehouses &middot; Plots &amp; Land in Hyderabad
                    </p>
                </div>
            </div>
        </footer>
    );
}
