import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Only load Geist Sans — Geist Mono is not used in any UI component
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevents FOIT — text shows immediately in fallback font
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F28C28",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://greylandinvest.com.ng"),
  title: "Greyland Investment Ltd - Consultancy & Supplies",
  description:
    "Greyland Investment Ltd offers consultancy and supplies services in Abuja, Nigeria. Contact us for reliable business solutions.",
  keywords: [
    "Greyland",
    "infrastructure",
    "engineering",
    "technology",
    "Nigeria",
    "IT solutions",
    "consultancy",
    "supplies",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Greyland Investment Ltd",
    url: "https://greylandinvest.com.ng",
    title: "Greyland Investment Ltd - Consultancy & Supplies",
    description:
      "Greyland Investment Ltd offers consultancy and supplies services in Abuja, Nigeria. Contact us for reliable business solutions.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Greyland Logo" }],
  },
  twitter: {
    card: "summary",
    title: "Greyland Investment Ltd",
    description: "Greyland Investment Ltd offers consultancy and supplies services in Abuja, Nigeria. Contact us for reliable business solutions.",
    images: ["/logo.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Greyland Investment Ltd",
    url: "https://greylandinvest.com.ng",
    email: "info@greylandinvest.com.ng",
    telephone: "+2348142707974",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 20 Lucky Uwagwu Street",
      addressLocality: "Lugbe",
      addressRegion: "Abuja",
      addressCountry: "NG"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
