"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* ── Animated 404 Badge ──────────────────────── */}
        <div className="relative mb-8 inline-block">
          <span className="text-[8rem] sm:text-[10rem] font-extrabold leading-none tracking-tight bg-gradient-to-br from-primary via-primary-hover to-accent bg-clip-text text-transparent select-none">
            404
          </span>
          <div className="absolute -inset-4 rounded-full bg-primary/5 blur-3xl -z-10" />
        </div>

        {/* ── Message ─────────────────────────────────── */}
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
          Page Not Found
        </h1>
        <p className="text-text-secondary text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* ── Action Buttons ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary-hover hover:shadow-lg transition-all duration-200 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-bg-card text-text-primary font-semibold text-sm border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 w-full sm:w-auto justify-center"
          >
            <Search className="w-4 h-4" />
            Search Properties
          </Link>
        </div>

        {/* ── Back Link ──────────────────────────────── */}
        <div className="mt-8">
          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go back to previous page
          </button>
        </div>
      </div>
    </section>
  );
}
