"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
  propertyCount: string;
  image: string;
}

const trendingLocations: Location[] = [
  {
    id: "loc-1",
    name: "Bandra West",
    propertyCount: "250+ Properties",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "loc-2",
    name: "Indiranagar",
    propertyCount: "420+ Properties",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "loc-3",
    name: "Koramangala",
    propertyCount: "315+ Properties",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "loc-4",
    name: "Juhu",
    propertyCount: "180+ Properties",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
  },
];

export function TrendingLocations() {
  return (
    <section className="py-12 lg:py-20 bg-slate-50/50">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">
              Trending in Your City
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-1">
              Explore most sought-after neighborhoods
            </p>
          </div>
        </div>

        {/* Responsive Grid: 2 cols on mobile, 4 cols on lg+ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingLocations.map((location) => (
            <Link
              key={location.id}
              href={`/search?location=${encodeURIComponent(location.name)}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl cursor-pointer",
                "aspect-square sm:aspect-[4/3] lg:aspect-[3/4]",
                "shadow-sm hover:shadow-md transition-shadow duration-300"
              )}
            >
              <Image
                src={location.image}
                alt={location.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-white truncate drop-shadow-md">
                  {location.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5 drop-shadow-md">
                  {location.propertyCount}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
