import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Covnant Reality India PVT LTD',
    description: 'Privacy Policy and data handling practices for Covnant Reality India PVT LTD.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-bg py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card border border-border overflow-hidden">
                <div className="bg-primary/5 border-b border-border px-8 py-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
                    <p className="text-text-secondary">Last updated: March 6, 2026</p>
                </div>

                <div className="px-8 py-10 space-y-8 text-text-secondary leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">1. Introduction</h2>
                        <p>
                            Welcome to Covnant Reality India PVT LTD. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">2. The Data We Collect About You</h2>
                        <p className="mb-4">
                            Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
                        </p>
                        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                            <li><strong>Financial Data:</strong> includes bank account and payment card details (if applicable).</li>
                            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">3. How We Use Your Personal Data</h2>
                        <p className="mb-4">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal obligation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">4. Data Security</h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact us at: <br />
                            <strong>Email:</strong> privacy@covnantreality.in<br />
                            <strong>Address:</strong> 123 Business Hub, Sector 45, New Delhi, India 110001
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
