import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, getWebPageSchema, getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/seo/CTASection";
import { InternalLinksGrid } from "@/components/seo/InternalLinksGrid";
import Link from "next/link";

export const metadata: Metadata = buildMetadata("commercial");

export default function CommercialPropertyHyderabadPage() {
  return (
    <main className="bg-bg min-h-screen">
      <JsonLd
        data={getWebPageSchema({
          name: "Commercial Property in Hyderabad",
          description:
            "Explore premium commercial property in Hyderabad – IT parks, retail spaces, co-working spaces, office buildings & more.",
          url: "https://www.covnantreality.com/commercial-property-hyderabad",
        })}
      />
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "https://www.covnantreality.com" },
          {
            name: "Commercial Property in Hyderabad",
            url: "https://www.covnantreality.com/commercial-property-hyderabad",
          },
        ])}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-bg to-primary/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-text-primary font-medium">Commercial Property in Hyderabad</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
            Commercial Property in Hyderabad
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">
            Discover premium commercial properties across Hyderabad&apos;s top business districts.
            From IT parks in HITEC City to retail spaces in Banjara Hills — find the perfect
            commercial space for your business with Covnant Reality.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search?property_type=commercial" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors">
              Browse Commercial Properties
            </Link>
            <Link href="/contact" className="inline-flex items-center px-6 py-3 border border-border text-text-primary rounded-xl font-medium hover:border-primary/30 transition-colors">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose prose-lg max-w-none">
          {/* Section 1 */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
              Why Invest in Commercial Property in Hyderabad?
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Hyderabad has emerged as one of India&apos;s most dynamic commercial real estate markets.
              With the rapid growth of IT parks in Hyderabad, the city&apos;s business districts have
              attracted global corporations, tech startups, and retail brands. The Financial District,
              HITEC City, and Gachibowli together form the backbone of Hyderabad&apos;s commercial ecosystem,
              offering world-class office buildings, co-working spaces, and commercial complexes.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              The Hyderabad property market continues to offer strong returns on commercial space for
              sale. With competitive prices compared to Bangalore and Mumbai, commercial property
              in Hyderabad delivers higher rental yields and capital appreciation. The city&apos;s
              robust infrastructure — including the Hyderabad Metro, Outer Ring Road, and proximity
              to Rajiv Gandhi International Airport — makes it an ideal destination for property
              investment in Hyderabad.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Whether you&apos;re looking for office space in Hyderabad for a multinational corporation
              or a compact retail unit for a local business, Hyderabad&apos;s business districts offer
              options across every budget and requirement. From prime commercial locations in Jubilee
              Hills to affordable business parks in Uppal, the city caters to diverse commercial needs.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
              Types of Commercial Properties We Offer
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              At Covnant Reality, we offer a comprehensive portfolio of commercial properties in
              Hyderabad. Our listings span every category of commercial real estate, ensuring you
              find the perfect space for your business.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 not-prose mb-6">
              {[
                {
                  title: "Office Buildings & Spaces",
                  desc: "Premium office space in Hyderabad ranging from 500 sq.ft. to entire floors in Grade A buildings. Furnished and unfurnished options available across HITEC City, Gachibowli, and Madhapur.",
                },
                {
                  title: "IT Parks & Tech Campuses",
                  desc: "Dedicated IT park offices in Hyderabad with plug-and-play infrastructure, 24/7 power backup, and high-speed connectivity. Ideal for tech companies and startups.",
                },
                {
                  title: "Retail Units & Showrooms",
                  desc: "High-visibility retail spaces in Hyderabad's top shopping districts. Perfect for retail shops, showrooms, and brand outlets in high-footfall areas.",
                },
                {
                  title: "Co-Working Spaces",
                  desc: "Flexible co-working space in Hyderabad with shared amenities, meeting rooms, and networking opportunities. Available in daily, monthly, and yearly plans.",
                },
                {
                  title: "Commercial Plots & Land",
                  desc: "Prime commercial plots in Hyderabad and commercial land for development. Strategically located near highways, business hubs, and residential clusters.",
                },
                {
                  title: "Commercial Complexes & Shops",
                  desc: "Shops for sale in Hyderabad within established commercial complexes. Steady footfall and established tenant base ensure reliable rental income.",
                },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-xl border border-border bg-bg-card hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
              Commercial Property for Sale vs Lease in Hyderabad
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Choosing between buying and leasing commercial property depends on your business goals,
              budget, and long-term plans. Both options offer distinct advantages in Hyderabad&apos;s
              thriving commercial real estate market.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mb-4">
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="font-bold text-text-primary mb-3">Office Sale / Purchase</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Long-term capital appreciation in prime locations</li>
                  <li>• Full control over customization and branding</li>
                  <li>• Rental income potential from commercial space for sale</li>
                  <li>• Tax benefits on commercial land and property ownership</li>
                  <li>• Ideal for businesses with stable, long-term space needs</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-accent/5 border border-accent/10">
                <h3 className="font-bold text-text-primary mb-3">Office Lease / Rent</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Lower upfront investment — preserve working capital</li>
                  <li>• Flexibility to scale up or relocate as business grows</li>
                  <li>• Access to premium locations at affordable monthly rates</li>
                  <li>• Maintenance and common area upkeep often included</li>
                  <li>• Perfect for startups, SMEs, and project-based teams</li>
                </ul>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Covnant Reality helps you evaluate both options — whether you want to buy commercial
              property in Hyderabad for investment or lease commercial space for operations. Our
              real estate brokers in Hyderabad provide expert guidance on office lease terms,
              commercial land valuations, and investment property returns.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
              Hyderabad&apos;s Top Commercial Localities
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Location is everything in commercial real estate. Here are Hyderabad&apos;s prime
              commercial locations where businesses thrive and investments grow.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
              {[
                {
                  locality: "HITEC City",
                  highlight: "Hyderabad's Silicon Valley — home to Google, Microsoft, Amazon campuses",
                  types: "IT parks, corporate offices, co-working spaces",
                },
                {
                  locality: "Gachibowli",
                  highlight: "Financial District & IT corridor with premium Grade A office buildings",
                  types: "Office buildings, tech parks, commercial complexes",
                },
                {
                  locality: "Banjara Hills",
                  highlight: "Premium retail & lifestyle destination with high-net-worth clientele",
                  types: "Retail showrooms, boutique offices, commercial shops",
                },
                {
                  locality: "Jubilee Hills",
                  highlight: "Upscale commercial zone with mix of offices and retail spaces",
                  types: "Office spaces, retail units, commercial plots",
                },
                {
                  locality: "Kondapur",
                  highlight: "Fast-growing commercial hub adjacent to HITEC City",
                  types: "Office space, co-working, startup hubs",
                },
                {
                  locality: "Madhapur",
                  highlight: "Cyber Towers area with established tech ecosystem",
                  types: "IT park offices, commercial space leasing, business parks",
                },
              ].map((loc) => (
                <div key={loc.locality} className="p-5 rounded-xl border border-border bg-bg-card">
                  <h3 className="font-bold text-primary text-lg">{loc.locality}</h3>
                  <p className="text-sm text-text-secondary mt-1">{loc.highlight}</p>
                  <p className="text-xs text-text-muted mt-2">
                    <span className="font-medium">Available:</span> {loc.types}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* CTA */}
        <CTASection
          title="Contact Our Commercial Property Experts"
          description="Looking for the perfect commercial space in Hyderabad? Our experienced real estate consultants will help you find, evaluate, and secure the ideal property for your business. Get a free consultation today."
        />

        {/* Internal Links */}
        <InternalLinksGrid currentPath="/commercial-property-hyderabad" />
      </div>
    </main>
  );
}
