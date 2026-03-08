import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Covnant Reality India PVT LTD',
    description: 'Learn more about Covnant Reality India PVT LTD, your trusted destination for modern real estate solutions.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-bg">
            {/* Hero Section */}
            <section className="bg-primary text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">About Covnant Reality India PVT LTD</h1>
                    <p className="text-lg md:text-xl text-primary-light max-w-3xl mx-auto leading-relaxed">
                        We are a leading real estate platform redefining how people discover, buy, and rent properties. Our mission is to provide transparent, reliable, and premium real estate experiences.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-text-primary">Our Vision</h2>
                        <p className="text-text-secondary leading-relaxed text-lg">
                            To become the most trusted and user-centric real estate platform in India, empowering individuals and businesses to find their perfect spaces with ease and confidence.
                        </p>
                        <p className="text-text-secondary leading-relaxed text-lg">
                            We believe that finding a home or a commercial space should not be a daunting task. With cutting-edge technology and a customer-first approach, we aim to simplify the entire real estate journey.
                        </p>
                    </div>
                    <div className="bg-slate-200 rounded-2xl aspect-video md:aspect-square flex items-center justify-center overflow-hidden relative shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
                        <div className="text-text-muted flex flex-col items-center">
                            <span className="text-5xl font-bold text-primary/30">Covnant</span>
                            <span className="text-xl font-medium text-primary/30 mt-2">Workspace</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="bg-bg-card p-8 rounded-2xl shadow-card border border-border text-center">
                        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-3">Premium Properties</h3>
                        <p className="text-text-secondary">Curated selection of the finest homes, apartments, and commercial spaces tailored to your lifestyle.</p>
                    </div>
                    <div className="bg-bg-card p-8 rounded-2xl shadow-card border border-border text-center">
                        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-3">Verified Listings</h3>
                        <p className="text-text-secondary">Every property goes through a rigorous verification process to ensure transparency and security.</p>
                    </div>
                    <div className="bg-bg-card p-8 rounded-2xl shadow-card border border-border text-center">
                        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-3">Expert Agents</h3>
                        <p className="text-text-secondary">Professional guidance from top-rated industry experts to help you make informed decisions.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
