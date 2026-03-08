"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How do I list my property on Covnant?",
            answer: "To list your property, you need to create an account and log in. Click on the 'Post Property' button on the header, fill out the required details regarding your property, add high-quality photos, and submit. Our team will verify and approve the listing."
        },
        {
            question: "Is there a fee for listing a property?",
            answer: "Basic property listings are entirely free. We also offer premium promotional packages for users who want maximum visibility and featured placement for their properties."
        },
        {
            question: "How do I contact a property owner or agent?",
            answer: "On every property detail page, you will find a contact form or a button to reveal the contact details of the agent or owner. You can send them a direct message or call their provided phone number."
        },
        {
            question: "Are the property listings verified?",
            answer: "We have a dedicated team that cross-checks all listings to ensure basic validity. Properties with a 'Verified' badge have undergone an extensive authenticity and background check by our professionals."
        },
        {
            question: "Can I save properties to view later?",
            answer: "Yes, you can save properties to your personalized Wishlist. Simply click the heart icon on any property card or details page while logged in, and it will be saved to your dashboard for quick access."
        },
        {
            question: "Are my personal details safe?",
            answer: "Absolutely. We are committed to protecting your privacy. We employ modern security practices to keep your data secure. Please refer to our Privacy Policy for more detailed information."
        }
    ];

    return (
        <div className="min-h-screen bg-bg">
            <div className="bg-primary pt-20 pb-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h1>
                    <p className="text-primary-light text-lg">
                        Find answers to the most common questions about our platform and services.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 -mt-10 mb-20">
                <div className="bg-white rounded-2xl shadow-card border border-border p-4 sm:p-8 space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border rounded-xl overflow-hidden transition-colors ${openIndex === index ? 'border-primary/30 bg-primary/5' : 'border-border bg-white hover:border-border-focus'}`}
                        >
                            <button
                                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className={`font-semibold pr-8 ${openIndex === index ? 'text-primary' : 'text-text-primary'}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'text-text-muted'}`}
                                />
                            </button>
                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="text-text-secondary leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center bg-white border border-border p-8 rounded-2xl">
                    <h3 className="text-xl font-bold text-text-primary xl mb-2">Still have questions?</h3>
                    <p className="text-text-secondary mb-6">Our support team is always ready to help you.</p>
                    <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-border bg-slate-50 text-text-primary font-medium rounded-xl hover:bg-slate-100 transition-colors">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
