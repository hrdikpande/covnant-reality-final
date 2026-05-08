"use client";

import Link from "next/link";

export function HomeSEOContent() {
  return (
    <section id="seo-content" className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
          Real Estate in Hyderabad &mdash; Commercial, Residential &amp; Industrial Properties
        </h2>
        <p className="text-text-secondary leading-relaxed mb-8">
          Covnant Reality is Hyderabad&apos;s trusted real estate company specializing in
          commercial property, residential properties, warehouses, and plots.
          Whether you&apos;re searching for office space in HITEC City, a warehouse in Patancheru,
          luxury apartments in Gachibowli, or commercial plots in the Financial District &mdash;
          we have the right property for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              <Link href="/commercial-property-hyderabad" className="hover:text-primary transition-colors">
                Commercial Property in Hyderabad
              </Link>
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Explore IT parks, co-working spaces, retail units, office buildings, and
              commercial complexes across all major business districts in Hyderabad.
              Find commercial space for sale and lease options in HITEC City, Gachibowli,
              and Banjara Hills.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              <Link href="/residential-properties-hyderabad" className="hover:text-primary transition-colors">
                Residential Properties in Hyderabad
              </Link>
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Browse RERA-approved gated communities, luxury apartments, villas,
              affordable housing, and new launch projects from top developers.
              Hyderabad flats and premium homes across all budgets.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              <Link href="/warehouse-hyderabad" className="hover:text-primary transition-colors">
                Warehouse &amp; Industrial Property in Hyderabad
              </Link>
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Find industrial-grade warehouses, logistics spaces, and commercial land
              near Hyderabad&apos;s key industrial corridors in Patancheru, Medchal,
              and Shamshabad.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              <Link href="/plots-land-hyderabad" className="hover:text-primary transition-colors">
                Plots &amp; Land Investment in Hyderabad
              </Link>
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Secure high-value residential and commercial plots in Hyderabad&apos;s
              fastest-growing localities. Verified plots with clear titles and
              HMDA/DTCP approvals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
