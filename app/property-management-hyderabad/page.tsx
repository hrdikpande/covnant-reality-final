import type { Metadata } from "next";
import { buildMetadata, BASE_URL } from "@/lib/seo/metadata";
import { JsonLd, getWebPageSchema, getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/seo/CTASection";
import { InternalLinksGrid } from "@/components/seo/InternalLinksGrid";
import { FaqSection } from "@/components/seo/FaqSection";
import Link from "next/link";

const FAQS = [
  {
    question: "What services are included in property management in Hyderabad?",
    answer:
      "Covnant Reality's property management covers tenant sourcing and screening, rent collection, preventive and reactive maintenance, regular property inspections with photo reports, legal documentation and lease agreements, investment advisory, and facility management for commercial properties.",
  },
  {
    question: "Do you offer property management for NRI property owners?",
    answer:
      "Yes. Covnant Reality provides dedicated NRI property management services, including power of attorney support, property tax management, and remote property oversight for owners living abroad.",
  },
  {
    question: "Is there a fee for property management services?",
    answer:
      "Covnant Reality uses transparent, upfront pricing with no hidden fees, and property owners receive detailed monthly statements along with online portal access to track rent, maintenance requests, and property reports in real time.",
  },
];

export const metadata: Metadata = buildMetadata("propertyManagement");

export default function PropertyManagementHyderabadPage() {
  return (
    <main className="bg-bg min-h-screen">
      <JsonLd data={getWebPageSchema({ name: "Property Management in Hyderabad", description: "Professional property management services in Hyderabad including rental management, tenant services, and real estate advisory.", url: `${BASE_URL}/property-management-hyderabad` })} />
      <JsonLd data={getBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Property Management in Hyderabad", url: `${BASE_URL}/property-management-hyderabad` }])} />

      <section className="bg-gradient-to-br from-primary/5 via-bg to-accent/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-text-primary font-medium">Property Management in Hyderabad</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">Property Management in Hyderabad</h1>
          <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">Professional property management services for residential and commercial properties in Hyderabad. From tenant sourcing to maintenance &mdash; we manage your property so you don&apos;t have to.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors">Get Property Management Quote</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="max-w-none">
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Complete Property Management Services</h2>
            <p className="text-text-secondary leading-relaxed mb-4">Managing property in Hyderabad &mdash; whether residential or commercial &mdash; requires time, expertise, and local knowledge. Covnant Reality&apos;s property management services handle every aspect of property ownership, from tenant sourcing and rent collection to maintenance and legal compliance.</p>
            <p className="text-text-secondary leading-relaxed mb-4">Our property management in Hyderabad covers both rental property management and commercial property management. We serve property owners who live abroad (NRI property management), busy professionals, and investors with multiple properties across Hyderabad.</p>
            <p className="text-text-secondary leading-relaxed">With our real estate advisory services, you get expert guidance on maximizing rental income, reducing vacancy periods, and maintaining your property&apos;s value. Our team of experienced property managers in India ensures your investment delivers consistent returns.</p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Our Property Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Tenant Management", desc: "Complete tenant management services including sourcing, screening, lease agreement preparation, and move-in coordination." },
                { title: "Rent Collection", desc: "Timely rent collection, payment tracking, and automated reminders. Monthly statements and annual reports." },
                { title: "Property Maintenance", desc: "Preventive and reactive property maintenance services. Plumbing, electrical, painting, pest control, and emergency repairs." },
                { title: "Property Inspection", desc: "Regular property inspection services with detailed photo reports. Ensure your property stays in excellent condition." },
                { title: "Legal & Documentation", desc: "Rental agreement drafting, lease renewal, legal verification, property registration assistance, and dispute resolution." },
                { title: "Investment Advisory", desc: "Real estate investment advisory for property portfolio management. Market analysis, investment property management, and growth strategies." },
                { title: "Facility Management", desc: "Comprehensive facility management for commercial properties. Security, housekeeping, landscaping, and common area maintenance." },
                { title: "Property Valuation", desc: "Professional property valuation services for sale, purchase, or loan purposes. Market-based valuations by certified valuers." },
                { title: "NRI Services", desc: "Dedicated NRI property management services. Power of attorney support, property tax management, and remote property oversight." },
              ].map((s) => (
                <div key={s.title} className="p-6 rounded-xl border border-border bg-bg-card hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-text-primary mb-2">{s.title}</h3>
                  <p className="text-sm text-text-secondary">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Why Choose Covnant Reality for Property Management?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Local Expertise", desc: "Deep knowledge of Hyderabad's property market, rental trends, and tenant preferences across all localities." },
                { title: "Transparent Pricing", desc: "No hidden fees. Clear, upfront pricing for all property services with detailed monthly statements." },
                { title: "Technology-Driven", desc: "Online portal for property owners to track rent, maintenance requests, and property reports in real-time." },
                { title: "Trusted Network", desc: "Established network of verified contractors, legal professionals, and service providers for quality maintenance." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-border bg-bg-card">
                  <div className="w-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                    <p className="text-sm text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <FaqSection faqs={FAQS} />
        </article>

        <CTASection title="Let Us Manage Your Property" description="Free yourself from the hassles of property management. Our professional team handles everything while you enjoy stress-free ownership." />
        <InternalLinksGrid currentPath="/property-management-hyderabad" />
      </div>
    </main>
  );
}
