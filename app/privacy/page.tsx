import type { Metadata } from "next";
import PrivacyContent from "@/components/privacy-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://admin.servi-pal.com";

export const metadata: Metadata = {
  title: "Privacy Policy — ServiPal",
  description: "ServiPal privacy policy. Learn how we collect, use, and protect your personal information.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Privacy Policy — ServiPal",
    description: "ServiPal privacy policy. Learn how we collect, use, and protect your personal information.",
    url: `${siteUrl}/privacy`,
    siteName: "ServiPal",
    type: "website",
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
