"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/data/faqs";

export function FaqClient() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
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
    );
}
