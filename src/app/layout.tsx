import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site, seo } from "@/data/config";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Metadata lengkap untuk SEO dan social sharing.
 * Fokus pada kata kunci "dealer JAECOO Medan" sesuai target.
 */
export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  authors: [{ name: `${site.brand} ${site.cityLong}` }],
  creator: site.legalName,
  publisher: site.legalName,
  applicationName: `Dealer ${site.brand} ${site.model} di ${site.city}`,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: seo.siteUrl,
    siteName: `Dealer ${site.brand} ${site.model} di ${site.city}`,
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: seo.ogImage,
        width: 1200,
        height: 630,
        alt: `Dealer resmi ${site.brand} ${site.model} di ${site.cityLong}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "automotive",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
};

export const viewport = {
  themeColor: "#0F7A83",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen bg-white antialiased">
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}