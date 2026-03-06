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
  title: "Greyland Investment Ltd | Innovative Technical Solutions",
  description:
    "Greyland Investment Ltd provides cutting-edge solutions across Engineering, Technology, and Infrastructure in Nigeria.",
  keywords: [
    "Greyland",
    "infrastructure",
    "engineering",
    "technology",
    "Nigeria",
    "IT solutions",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Greyland Investment Ltd",
    title: "Greyland Investment Ltd | Innovative Technical Solutions",
    description:
      "Enterprise Engineering, Technology, and Infrastructure solutions across public and private sectors.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Greyland Logo" }],
  },
  twitter: {
    card: "summary",
    title: "Greyland Investment Ltd",
    description: "Engineering, Technology & Infrastructure Solutions.",
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
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
