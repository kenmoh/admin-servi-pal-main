import type { Metadata } from "next";
import TermsContent from "@/components/terms-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://servi-pal.com";

export const metadata: Metadata = {
  title: "Terms of Service — ServiPal",
  description: "ServiPal terms of service. Read our terms and conditions for using the platform.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Terms of Service — ServiPal",
    description: "ServiPal terms of service. Read our terms and conditions for using the platform.",
    url: `${siteUrl}/terms-of-service`,
    siteName: "ServiPal",
    type: "website",
  },
};

export default function TermsOfServicePage() {
  return <TermsContent />;
}
