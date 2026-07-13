import type { Metadata } from 'next';
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/lib/data/faqs";
import { FaqClient } from "./FaqClient";

export const metadata: Metadata = buildMetadata("faq");

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-bg">
            {/* FAQPage schema: no longer a Google rich-result trigger, but still a
                useful entity/claim-verification signal for AI Overviews and AI Mode. */}
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: faqs.map((faq) => ({
                        "@type": "Question",
                        name: faq.question,
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: faq.answer,
                        },
                    })),
                }}
            />

            <div className="bg-primary pt-20 pb-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h1>
                    <p className="text-primary-light text-lg">
                        Find answers to the most common questions about our platform and services.
                    </p>
                </div>
            </div>

            <FaqClient />
        </div>
    );
}
