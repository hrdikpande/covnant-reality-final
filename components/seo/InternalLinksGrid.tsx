"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const LANDING_PAGES = [
  {
    href: "/commercial-property-hyderabad",
    label: "Commercial Property in Hyderabad",
    description: "IT parks, offices, retail spaces & co-working",
  },
  {
    href: "/residential-properties-hyderabad",
    label: "Residential Properties in Hyderabad",
    description: "Flats, villas, apartments & gated communities",
  },
  {
    href: "/warehouse-hyderabad",
    label: "Warehouse in Hyderabad",
    description: "Industrial warehouses & storage spaces",
  },
  {
    href: "/plots-land-hyderabad",
    label: "Plots & Land in Hyderabad",
    description: "Commercial & residential plots",
  },
  {
    href: "/property-management-hyderabad",
    label: "Property Management in Hyderabad",
    description: "Rental management & advisory services",
  },
];

interface InternalLinksGridProps {
  /** Hide the link whose href matches this path */
  currentPath?: string;
}

export function InternalLinksGrid({ currentPath }: InternalLinksGridProps) {
  const links = LANDING_PAGES.filter((l) => l.href !== currentPath);

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold text-text-primary mb-8">
        Explore More Properties in Hyderabad
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group p-5 rounded-xl border border-border bg-bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200"
          >
            <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors text-sm">
              {link.label}
            </h3>
            <p className="text-xs text-text-muted mt-1">{link.description}</p>
            <span className="inline-flex items-center gap-1 text-xs text-primary mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Explore <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
