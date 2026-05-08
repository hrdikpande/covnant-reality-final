import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, getWebPageSchema, getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/seo/CTASection";
import { InternalLinksGrid } from "@/components/seo/InternalLinksGrid";
import Link from "next/link";

export const metadata: Metadata = buildMetadata("residential");

export default function ResidentialPropertiesHyderabadPage() {
  return (
    <main className="bg-bg min-h-screen">
      <JsonLd data={getWebPageSchema({ name: "Residential Properties in Hyderabad", description: "Browse luxury apartments, gated communities, villas, and affordable housing in Hyderabad.", url: "https://www.covnantreality.com/residential-properties-hyderabad" })} />
      <JsonLd data={getBreadcrumbSchema([{ name: "Home", url: "https://www.covnantreality.com" }, { name: "Residential Properties in Hyderabad", url: "https://www.covnantreality.com/residential-properties-hyderabad" }])} />

      <section className="bg-gradient-to-br from-accent/5 via-bg to-accent/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-text-primary font-medium">Residential Properties in Hyderabad</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">Residential Properties in Hyderabad</h1>
          <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">Find your dream home in Hyderabad &mdash; from luxury apartments and premium villas to affordable flats and gated communities. Browse RERA-approved residential projects from top developers.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search?property_type=apartment" className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors">Browse Residential Properties</Link>
            <Link href="/contact" className="px-6 py-3 border border-border text-text-primary rounded-xl font-medium hover:border-primary/30 transition-colors">Get Expert Guidance</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="max-w-none">
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Residential Properties for Every Budget in Hyderabad</h2>
            <p className="text-text-secondary leading-relaxed mb-4">Hyderabad&apos;s residential real estate market offers something for every home buyer. Whether you&apos;re a first-time buyer looking for affordable housing or an investor eyeing luxury apartments, the city&apos;s residential landscape is diverse and growing. Hyderabad flats are available at price points ranging from &#8377;25 lakhs in emerging localities to &#8377;5+ crores in premium neighborhoods.</p>
            <p className="text-text-secondary leading-relaxed mb-4">The demand for premium apartments and premium villas in Hyderabad has surged, driven by the city&apos;s booming IT sector and excellent quality of life. Areas like Gachibowli, Kondapur, and Jubilee Hills host some of the most sought-after luxury homes with world-class amenities, smart home features, and contemporary architecture.</p>
            <p className="text-text-secondary leading-relaxed">For budget-conscious buyers, affordable housing projects in areas like Miyapur, Bachupally, and Kompally offer modern apartments with essential amenities at competitive prices. Many of these are bank approved projects with flexible home loan options, making home buying accessible to a wider audience.</p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Explore Our Residential Projects</h2>
            <p className="text-text-secondary leading-relaxed mb-6">Covnant Reality partners with Hyderabad&apos;s top real estate developers to bring you verified, high-quality residential projects. Every project listed is thoroughly vetted for legal compliance, construction quality, and developer reputation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {[
                { title: "Gated Communities", desc: "Secure, self-contained gated community projects with clubs, pools, parks, and 24/7 security. Popular in Gachibowli, Kondapur, and Bachupally." },
                { title: "Township Projects", desc: "Integrated township projects with residential, commercial, and recreational zones. Schools, hospitals, and shopping within the campus." },
                { title: "Villa Projects", desc: "Independent villa projects and duplex homes with private gardens. Premium villas in gated layouts across Hyderabad." },
                { title: "RERA Approved Projects", desc: "All our residential projects are RERA approved, ensuring transparency, accountability, and on-time delivery." },
                { title: "New Launch Projects", desc: "Be the first to invest in new launch projects at pre-launch prices. Early buyers get the best units and pricing advantages." },
                { title: "Studio Apartments", desc: "Studio apartments and compact 1BHK units ideal for young professionals and investors looking for rental income properties." },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-xl border border-border bg-bg-card hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Popular Residential Areas in Hyderabad</h2>
            <p className="text-text-secondary leading-relaxed mb-6">Hyderabad&apos;s residential real estate spans across diverse neighborhoods, each offering a unique lifestyle and investment potential.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { area: "Gachibowli", price: "65L-2.5Cr", highlight: "IT hub proximity, top schools, premium apartments" },
                { area: "Kondapur", price: "50L-1.8Cr", highlight: "Affordable luxury, metro connectivity, gated communities" },
                { area: "Miyapur", price: "30L-90L", highlight: "Metro accessible, affordable flats, growing infrastructure" },
                { area: "Bachupally", price: "28L-85L", highlight: "Emerging hotspot, new launch projects, affordable housing" },
                { area: "Kompally", price: "25L-80L", highlight: "Northern corridor growth, villa projects, open spaces" },
                { area: "Uppal", price: "35L-1Cr", highlight: "Eastern Hyderabad, value for money, good connectivity" },
                { area: "Jubilee Hills", price: "1.5Cr-8Cr", highlight: "Ultra-premium, luxury homes, penthouse options" },
                { area: "Banjara Hills", price: "1.2Cr-6Cr", highlight: "Prime location, luxury apartments, lifestyle living" },
                { area: "Manikonda", price: "40L-1.2Cr", highlight: "Near Financial District, family-friendly, residential projects" },
              ].map((loc) => (
                <div key={loc.area} className="p-5 rounded-xl border border-border bg-bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-primary">{loc.area}</h3>
                    <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">{loc.price}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{loc.highlight}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Why Choose Covnant Reality for Your Home?</h2>
            <p className="text-text-secondary leading-relaxed mb-4">Buying a home is the biggest financial decision most people make. At Covnant Reality, we understand the importance of getting it right. As a trusted real estate consultant in Hyderabad, we provide end-to-end support throughout your home buying journey.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {[
                { title: "Verified Listings", desc: "Every property is physically verified. No fake listings, no misleading photos." },
                { title: "Legal Verification", desc: "Complete title verification, RERA compliance check, and property document verification." },
                { title: "Expert Property Brokers", desc: "Experienced property brokers guide you through negotiations, paperwork, and registration." },
                { title: "Bank Approved Projects", desc: "We prioritize bank approved projects so you can secure home loans quickly." },
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
            <p className="text-text-secondary leading-relaxed">Whether you&apos;re searching for houses, flats, villas, or duplex homes &mdash; our team handles property search, property valuation, stamp duty guidance, registration charges consultation, and post-purchase property management. We are your complete property company in Hyderabad.</p>
          </section>
        </article>

        <CTASection title="Find Your Dream Home Today" description="Let our residential property experts help you find the perfect home in Hyderabad. Schedule a free property consultation now." />
        <InternalLinksGrid currentPath="/residential-properties-hyderabad" />
      </div>
    </main>
  );
}
