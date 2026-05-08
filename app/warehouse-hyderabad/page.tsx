import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, getWebPageSchema, getBreadcrumbSchema } from "@/components/seo/JsonLd";
import { CTASection } from "@/components/seo/CTASection";
import { InternalLinksGrid } from "@/components/seo/InternalLinksGrid";
import Link from "next/link";

export const metadata: Metadata = buildMetadata("warehouse");

export default function WarehouseHyderabadPage() {
  return (
    <main className="bg-bg min-h-screen">
      <JsonLd data={getWebPageSchema({ name: "Warehouse in Hyderabad", description: "Find industrial property, warehouses, and commercial land across all major business districts in Hyderabad.", url: "https://www.covnantreality.com/warehouse-hyderabad" })} />
      <JsonLd data={getBreadcrumbSchema([{ name: "Home", url: "https://www.covnantreality.com" }, { name: "Warehouse in Hyderabad", url: "https://www.covnantreality.com/warehouse-hyderabad" }])} />

      <section className="bg-gradient-to-br from-warning/5 via-bg to-warning/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-text-primary font-medium">Warehouse in Hyderabad</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">Warehouse in Hyderabad</h1>
          <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">Find the best warehouses, industrial properties, and commercial land in Hyderabad. From cold storage facilities to logistics hubs &mdash; Covnant Reality connects you with the right industrial space.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search?property_type=commercial&subtype=warehouse" className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors">Browse Warehouses</Link>
            <Link href="/contact" className="px-6 py-3 border border-border text-text-primary rounded-xl font-medium hover:border-primary/30 transition-colors">Talk to Industrial Experts</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="max-w-none">
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Find the Best Warehouses in Hyderabad</h2>
            <p className="text-text-secondary leading-relaxed mb-4">Hyderabad has become a major warehousing and logistics hub in India, driven by its strategic location, excellent road connectivity, and proximity to major industrial corridors. The city&apos;s warehouse market serves e-commerce giants, manufacturing firms, pharmaceutical companies, and FMCG distributors.</p>
            <p className="text-text-secondary leading-relaxed mb-4">Industrial property in Hyderabad offers excellent value compared to Mumbai, Pune, and Bangalore. With the growth of e-commerce and third-party logistics (3PL), demand for modern warehouse spaces has skyrocketed. Warehouse for rent in Hyderabad starts from as low as &#8377;12/sq.ft., while purchase options on commercial land in Hyderabad provide long-term investment returns.</p>
            <p className="text-text-secondary leading-relaxed">Covnant Reality specializes in warehouse listings across Hyderabad&apos;s key industrial zones. Whether you need a small warehouse for local distribution or a large logistics facility for national operations, we have options across every size and budget range.</p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Types of Warehouses Available</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {[
                { title: "Cold Storage Warehouses", desc: "Temperature-controlled facilities for pharmaceuticals, food products, and perishable goods. Available in Shamshabad, Medchal, and Patancheru." },
                { title: "Dry Warehouses", desc: "Standard warehousing for FMCG, retail, automotive, and general merchandise. Wide range of sizes from 5,000 to 100,000+ sq.ft." },
                { title: "Logistics & Distribution Hubs", desc: "Strategically located near highways and airports for efficient supply chain operations. Ideal for e-commerce fulfillment centers." },
                { title: "Industrial Sheds & Factories", desc: "Heavy-duty industrial sheds with loading docks, high ceilings, and heavy power supply. Suitable for manufacturing and assembly operations." },
                { title: "Flex Warehouses", desc: "Flexible warehouse spaces that combine storage, office, and showroom areas. Perfect for small businesses and growing enterprises." },
                { title: "Bonded Warehouses", desc: "Customs-bonded warehouses near SEZ areas for import/export businesses. Secure facilities with government approvals." },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-xl border border-border bg-bg-card hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Top Warehouse Zones in Hyderabad</h2>
            <p className="text-text-secondary leading-relaxed mb-6">Hyderabad&apos;s industrial property landscape is concentrated across several key zones, each offering distinct advantages for warehousing and logistics operations.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { zone: "Patancheru", highlight: "Hyderabad's largest industrial belt with established warehousing infrastructure and pharmaceutical clusters." },
                { zone: "Medchal", highlight: "Northern industrial corridor with affordable warehouse land, excellent NH-44 connectivity." },
                { zone: "Shamshabad", highlight: "Airport proximity makes it ideal for air cargo, cold chain, and export-oriented warehousing." },
                { zone: "Bonthapally", highlight: "Emerging warehouse hub with large land parcels available at competitive prices." },
                { zone: "Kowlur / Jeedimetla", highlight: "Established industrial estate with chemical, pharma, and general warehousing facilities." },
                { zone: "Kandlakoya / Kompally", highlight: "Growing industrial zone on NH-44 corridor with new warehouse developments." },
              ].map((z) => (
                <div key={z.zone} className="p-5 rounded-xl border border-border bg-bg-card">
                  <h3 className="font-bold text-primary text-lg">{z.zone}</h3>
                  <p className="text-sm text-text-secondary mt-2">{z.highlight}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Warehouse for Rent vs Purchase &mdash; What&apos;s Right for You?</h2>
            <p className="text-text-secondary leading-relaxed mb-4">Deciding between renting and purchasing a warehouse depends on your business stage, capital availability, and long-term plans. Both property rent and property sale options are available across Hyderabad&apos;s industrial zones.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="font-bold text-text-primary mb-3">Warehouse for Rent</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>&bull; Lower initial investment, preserve cash flow</li>
                  <li>&bull; Flexibility to scale up or relocate</li>
                  <li>&bull; Maintenance often included in lease agreement</li>
                  <li>&bull; Ideal for startups, seasonal businesses, 3PL operators</li>
                  <li>&bull; Short-term and long-term warehouse rental options</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-accent/5 border border-accent/10">
                <h3 className="font-bold text-text-primary mb-3">Warehouse for Sale</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>&bull; Long-term asset appreciation on industrial land</li>
                  <li>&bull; Full customization of layout and infrastructure</li>
                  <li>&bull; Rental income from unused capacity</li>
                  <li>&bull; Tax benefits on property ownership</li>
                  <li>&bull; Best for established businesses with stable operations</li>
                </ul>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed">Covnant Reality&apos;s industrial property team helps you evaluate both options based on your business requirements, budget, and growth trajectory. We handle property valuation, lease agreement negotiations, and sale deed processing.</p>
          </section>
        </article>

        <CTASection title="Talk to Our Industrial Property Team" description="Need a warehouse in Hyderabad? Our industrial real estate experts will help you find the perfect space at the best price. Get a free site visit and consultation." />
        <InternalLinksGrid currentPath="/warehouse-hyderabad" />
      </div>
    </main>
  );
}
