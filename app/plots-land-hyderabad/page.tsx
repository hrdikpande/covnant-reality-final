import type { Metadata } from "next";
import { buildMetadata, BASE_URL } from "@/lib/seo/metadata";
import { JsonLd, getWebPageSchema, getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/seo/CTASection";
import { InternalLinksGrid } from "@/components/seo/InternalLinksGrid";
import { FaqSection } from "@/components/seo/FaqSection";
import Link from "next/link";

const FAQS = [
  {
    question: "Is buying a plot in Hyderabad a good investment?",
    answer:
      "Plots in Hyderabad have consistently delivered 15-25% annual appreciation in emerging corridors, driven by the city's infrastructure development and IT-sector growth. Unlike apartments, plots also offer the flexibility to build, develop, or hold for capital appreciation.",
  },
  {
    question: "What documents should I verify before buying a plot in Hyderabad?",
    answer:
      "Verify the HMDA/DTCP layout approval, the title deed and ownership chain going back 30+ years, a clear encumbrance certificate (EC), absence of pending litigation, property tax payment receipts, land use zoning, survey number and boundaries, and any government acquisition notices.",
  },
  {
    question: "What's the difference between residential and commercial plots in Hyderabad?",
    answer:
      "Residential plots are HMDA/DTCP-approved for building homes, typically 100 to 1000+ sq.yards, ideal for personal use or long-term investment. Commercial plots sit on prime roads and highways, are zoned for commercial or mixed-use development, cost more per sq.ft., but offer stronger rental yields.",
  },
];

export const metadata: Metadata = buildMetadata("plots");

export default function PlotsLandHyderabadPage() {
  return (
    <main className="bg-bg min-h-screen">
      <JsonLd data={getWebPageSchema({ name: "Plots and Land in Hyderabad", description: "Invest in plots and land in Hyderabad. Find commercial plots, residential plots, and farmhouse land at the best prices.", url: `${BASE_URL}/plots-land-hyderabad` })} />
      <JsonLd data={getBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Plots & Land in Hyderabad", url: `${BASE_URL}/plots-land-hyderabad` }])} />

      <section className="bg-gradient-to-br from-accent/5 via-bg to-primary/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-text-primary font-medium">Plots &amp; Land in Hyderabad</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">Plots and Land in Hyderabad</h1>
          <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">Invest in high-value plots and land across Hyderabad&apos;s fastest-growing localities. Commercial plots, residential plots, and farmhouse land at competitive prices.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search?property_type=plot" className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors">Browse Plots</Link>
            <Link href="/contact" className="px-6 py-3 border border-border text-text-primary rounded-xl font-medium hover:border-primary/30 transition-colors">Investment Consultation</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="max-w-none">
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Why Buy Plots in Hyderabad?</h2>
            <p className="text-text-secondary leading-relaxed mb-4">Hyderabad is one of the best cities in India for plot investment. The city&apos;s rapid expansion, world-class infrastructure development, and booming IT sector have created unprecedented demand for land. Plots in Hyderabad have consistently delivered 15-25% annual appreciation in emerging corridors, making land investment one of the most reliable wealth-building strategies.</p>
            <p className="text-text-secondary leading-relaxed mb-4">Unlike apartments or commercial property, plots offer complete flexibility &mdash; build your dream home, develop a commercial project, or hold for capital appreciation. Commercial plots in Hyderabad near IT corridors and highways have seen the highest demand, while residential plots in areas like Shadnagar, Adibatla, and Mokila offer affordable entry points with strong growth potential.</p>
            <p className="text-text-secondary leading-relaxed">Covnant Reality brings you verified plots with clear titles, DTCP/HMDA approvals, and complete legal verification. Every plot listing on our platform undergoes thorough due diligence to protect your investment.</p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Residential vs Commercial Plots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="font-bold text-text-primary mb-3">Residential Plots</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>&bull; Build your custom home with full design control</li>
                  <li>&bull; Available in gated plot layouts with amenities</li>
                  <li>&bull; HMDA/DTCP approved plots in Hyderabad suburbs</li>
                  <li>&bull; Sizes from 100 sq.yards to 1000+ sq.yards</li>
                  <li>&bull; Ideal for personal use or long-term investment</li>
                  <li>&bull; Farmhouse plots available in scenic outskirts</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-accent/5 border border-accent/10">
                <h3 className="font-bold text-text-primary mb-3">Commercial Plots</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>&bull; Prime locations on main roads and highways</li>
                  <li>&bull; Zoned for commercial development and mixed-use</li>
                  <li>&bull; Higher price per sq.ft. but stronger rental yields</li>
                  <li>&bull; Ideal for retail outlets, offices, showrooms</li>
                  <li>&bull; Industrial plots near SEZs and industrial parks</li>
                  <li>&bull; Commercial land for warehouse and factory development</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Top Plot Investment Zones in Hyderabad</h2>
            <p className="text-text-secondary leading-relaxed mb-6">Investing in the right location is crucial for maximizing returns on plot investment. Here are Hyderabad&apos;s top zones for land investment in 2026.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { zone: "Shadnagar", price: "3K-8K/sq.yd", highlight: "Pharma City proximity, affordable entry point, HMDA approved layouts" },
                { zone: "Adibatla", price: "5K-15K/sq.yd", highlight: "Near Aerospace SEZ, rapid development, excellent ROI potential" },
                { zone: "Mokila", price: "8K-20K/sq.yd", highlight: "Western corridor growth, residential plot layouts, nature surroundings" },
                { zone: "Yadagirigutta", price: "2K-6K/sq.yd", highlight: "Temple town development, ORR connectivity, emerging growth corridor" },
                { zone: "Sangareddy", price: "4K-12K/sq.yd", highlight: "Industrial corridor, Pharma City spillover, highway connectivity" },
                { zone: "Maheshwaram", price: "6K-18K/sq.yd", highlight: "RRR (Regional Ring Road) impact zone, future growth potential" },
              ].map((z) => (
                <div key={z.zone} className="p-5 rounded-xl border border-border bg-bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-primary">{z.zone}</h3>
                    <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">{z.price}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{z.highlight}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">How to Verify Plot Documents</h2>
            <p className="text-text-secondary leading-relaxed mb-4">Before buying any plot or land in Hyderabad, it&apos;s essential to verify the legal documents and approvals. Here&apos;s a checklist that every buyer should follow:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Verify HMDA/DTCP layout approval",
                "Check title deed and ownership chain (30+ years)",
                "Confirm encumbrance certificate (EC) is clear",
                "Verify no pending litigation or disputes",
                "Check property tax payment receipts",
                "Confirm land use zoning (residential/commercial)",
                "Verify survey number and boundaries",
                "Check for any government acquisition notices",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-3 rounded-lg bg-bg-card">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5">&check;</span>
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <FaqSection faqs={FAQS} />
        </article>

        <CTASection title="Start Your Land Investment Journey" description="Our plot and land experts will help you find verified, legally clear plots in Hyderabad's best growth corridors. Get a free investment consultation today." />
        <InternalLinksGrid currentPath="/plots-land-hyderabad" />
      </div>
    </main>
  );
}
