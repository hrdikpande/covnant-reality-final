// ─── Shared FAQ Content ──────────────────────────────────────────────────────
// Single source of truth for the /faq page — used both by the client-rendered
// accordion (FaqClient.tsx) and the server-rendered FAQPage JSON-LD schema.

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "How do I list my property on Covnant?",
    answer:
      "To list your property, you need to create an account and log in. Click on the 'Post Property' button on the header, fill out the required details regarding your property, add high-quality photos, and submit. Our team will verify and approve the listing.",
  },
  {
    question: "Is there a fee for listing a property?",
    answer:
      "Basic property listings are entirely free. We also offer premium promotional packages for users who want maximum visibility and featured placement for their properties.",
  },
  {
    question: "How do I contact a property owner or agent?",
    answer:
      "On every property detail page, you will find a contact form or a button to reveal the contact details of the agent or owner. You can send them a direct message or call their provided phone number.",
  },
  {
    question: "Are the property listings verified?",
    answer:
      "We have a dedicated team that cross-checks all listings to ensure basic validity. Properties with a 'Verified' badge have undergone an extensive authenticity and background check by our professionals.",
  },
  {
    question: "Can I save properties to view later?",
    answer:
      "Yes, you can save properties to your personalized Wishlist. Simply click the heart icon on any property card or details page while logged in, and it will be saved to your dashboard for quick access.",
  },
  {
    question: "Are my personal details safe?",
    answer:
      "Absolutely. We are committed to protecting your privacy. We employ modern security practices to keep your data secure. Please refer to our Privacy Policy for more detailed information.",
  },
];
