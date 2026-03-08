import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Covnant Reality India PVT LTD',
    description: 'Terms of Service and usage conditions for Covnant Reality India PVT LTD.',
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-bg py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card border border-border overflow-hidden">
                <div className="bg-primary/5 border-b border-border px-8 py-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Terms of Service</h1>
                    <p className="text-text-secondary">Last updated: March 6, 2026</p>
                </div>

                <div className="px-8 py-10 space-y-8 text-text-secondary leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">1. Agreement to Terms</h2>
                        <p>
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and Covnant Reality India PVT LTD (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">2. Intellectual Property Rights</h2>
                        <p>
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &quot;Content&quot;) and the trademarks, service marks, and logos contained therein (the &quot;Marks&quot;) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">3. User Representations</h2>
                        <p className="mb-4">
                            By using the Site, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                            <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
                            <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">4. Property Listings</h2>
                        <p>
                            Users who list properties on our platform are solely responsible for the accuracy of the information provided. We reserve the right to remove or modify any listing that violates our policies, is factually incorrect, or is deemed inappropriate at our sole discretion. We are not liable for any discrepancies between the listed information and the actual property.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">5. Modifications and Interruptions</h2>
                        <p>
                            We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">6. Contact Us</h2>
                        <p>
                            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <br />
                            <strong>Email:</strong> legal@covnantreality.in<br />
                            <strong>Address:</strong> 123 Business Hub, Sector 45, New Delhi, India 110001
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
