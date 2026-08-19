import type { Metadata } from "next";
import AboutContent from "@/components/about-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://admin.servi-pal.com";

export const metadata: Metadata = {
  title: "About ServiPal — Our Mission & Services",
  description: "Learn about ServiPal, Nigeria's all-in-one platform for food ordering, package delivery, laundry services, and P2P marketplace with escrow protection.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "About ServiPal",
    description: "Learn about ServiPal, Nigeria's all-in-one platform for food ordering, package delivery, laundry services, and P2P marketplace.",
    url: `${siteUrl}/about`,
    siteName: "ServiPal",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
