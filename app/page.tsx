import type { Metadata } from "next";
import LandingPage from "@/components/landing-page";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://servi-pal.com";

export const metadata: Metadata = {
  title: "ServiPal — Food Ordering, Delivery, Laundry & Marketplace",
  description:
    "Order meals from top restaurants, send parcels across the city, get your laundry picked up, and shop safely with escrow protection. All your daily services in one app.",
  keywords: [
    "food ordering Nigeria",
    "food delivery Lagos",
    "laundry service app",
    "package delivery Nigeria",
    "online marketplace escrow",
    "dispatch riders Lagos",
    "order food online",
    "laundry pickup delivery",
    "ServiPal",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "ServiPal",
    title: "ServiPal — Food Ordering, Delivery, Laundry & Marketplace",
    description:
      "Order meals from top restaurants, send parcels across the city, get your laundry picked up, and shop safely with escrow protection.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ServiPal - All your daily services in one app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ServiPal — Food Ordering, Delivery, Laundry & Marketplace",
    description:
      "Order meals from top restaurants, send parcels across the city, get your laundry picked up, and shop safely with escrow protection.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <LandingPage />;
}
