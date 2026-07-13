// ─── Reusable Page FAQ Section ───────────────────────────────────────────────
// Server component: renders native <details>/<summary> (no client JS needed,
// so the full answer text is present in the initial HTML for AI crawlers that
// don't execute JavaScript) and emits matching FAQPage JSON-LD.

import { JsonLd } from "@/components/seo/JsonLd";

export interface PageFaq {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: PageFaq[];
  title?: string;
}

export function FaqSection({ faqs, title = "Frequently Asked Questions" }: FaqSectionProps) {
  if (!faqs.length) return null;

  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">{title}</h2>
      <div className="space-y-3 not-prose">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-border bg-bg-card p-5 open:border-primary/30"
          >
            <summary className="cursor-pointer list-none font-semibold text-text-primary flex items-center justify-between gap-4">
              {faq.question}
              <span className="text-text-muted transition-transform group-open:rotate-45 shrink-0">+</span>
            </summary>
            <p className="text-sm text-text-secondary leading-relaxed mt-3">{faq.answer}</p>
          </details>
        ))}
      </div>

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
    </section>
  );
}
