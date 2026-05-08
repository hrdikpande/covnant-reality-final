import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchContent } from './SearchContent';
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata("search");

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center text-text-secondary">Loading search results...</div>}>
            <SearchContent />
        </Suspense>
    );
}
