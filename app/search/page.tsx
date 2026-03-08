import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchContent } from './SearchContent';

export const metadata: Metadata = {
    title: 'Search Properties | Covnant Reality India PVT LTD',
    description: 'Search and find your perfect property with Covnant Reality India PVT LTD.',
};

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center text-text-secondary">Loading search results...</div>}>
            <SearchContent />
        </Suspense>
    );
}
