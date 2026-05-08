"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

interface CTASectionProps {
  title: string;
  description: string;
  contactHref?: string;
}

export function CTASection({
  title,
  description,
  contactHref = "/contact",
}: CTASectionProps) {
  return (
    <section className="mt-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover p-8 md:p-12 text-white text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
      <p className="text-white/80 max-w-2xl mx-auto mb-8 text-sm md:text-base">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={contactHref}
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Contact Us
        </Link>
        <Link
          href={contactHref}
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Get Free Consultation
        </Link>
      </div>
    </section>
  );
}
