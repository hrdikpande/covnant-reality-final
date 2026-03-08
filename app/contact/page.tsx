"use client";

import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-bg">
            {/* Header */}
            <div className="bg-white border-b border-border py-12 px-4 shadow-sm">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Contact Us</h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Have a question about a property, our services, or anything else? Our team is ready to answer all your questions.
                    </p>
                </div>
            </div>

            {/* Contact Content */}
            {/* Contact Info */}
            <div className="max-w-xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-6">Get in Touch</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <MapPin className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary text-lg">Our Office</h3>
                                <p className="text-text-secondary mt-1 leading-relaxed">
                                    Covnant Reality India PVT LTD<br />
                                    123 Business Hub, Sector 45<br />
                                    New Delhi, India 110001
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Phone className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary text-lg">Call Us</h3>
                                <p className="text-text-secondary mt-1">
                                    +91 98765 43210<br />
                                    Mon-Fri from 9am to 6pm
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Mail className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary text-lg">Email Us</h3>
                                <p className="text-text-secondary mt-1">
                                    support@covnantreality.in<br />
                                    info@covnantreality.in
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
