import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { PropertyProvider } from "@/components/PropertyContext";

import { PropertyStoreProvider } from "@/components/PropertyStoreContext";
import { AuthProvider } from "@/components/AuthContext";
import { LocationProvider } from "@/components/LocationContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.covnantreality.com"),
  title: {
    default: "Covnant Reality – Commercial & Residential Properties in Hyderabad",
    template: "%s | Covnant Reality",
  },
  description:
    "Find the best commercial property, residential properties, warehouses, and plots in Hyderabad. Covnant Reality – Hyderabad's trusted real estate company.",
  keywords: [
    "commercial property hyderabad",
    "residential properties hyderabad",
    "warehouse in hyderabad",
    "plots hyderabad",
    "real estate hyderabad",
    "office space hyderabad",
    "flats in hyderabad",
    "villas hyderabad",
    "property in hyderabad",
    "real estate company hyderabad",
  ],
  authors: [{ name: "Covnant Reality" }],
  creator: "Covnant Reality",
  publisher: "Covnant Reality",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "QaKdfjjYWbl-xrStaiJ5xD2ERrjnjPUUDe4F34fR0fw",
    other: {
      "msvalidate.01": "2E4D98900ECB345C872D5A82A49DCD46",
    },
  },
  alternates: {
    canonical: "https://www.covnantreality.com",
  },
  openGraph: {
    title: "Covnant Reality – Commercial & Residential Properties in Hyderabad",
    description:
      "Find the best commercial property, residential properties, warehouses, and plots in Hyderabad. Covnant Reality – Hyderabad's trusted real estate company.",
    url: "https://www.covnantreality.com",
    siteName: "Covnant Reality",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Covnant Reality – Commercial & Residential Properties in Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Covnant Reality – Commercial & Residential Properties in Hyderabad",
    description:
      "Find the best commercial property, residential properties, warehouses, and plots in Hyderabad.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="QaKdfjjYWbl-xrStaiJ5xD2ERrjnjPUUDe4F34fR0fw" />
        <meta name="msvalidate.01" content="2E4D98900ECB345C872D5A82A49DCD46" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-bg text-text-primary`} suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            <LocationProvider>
              <PropertyStoreProvider>
                <PropertyProvider>
                  <AppShell>{children}</AppShell>
                </PropertyProvider>
              </PropertyStoreProvider>
            </LocationProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
