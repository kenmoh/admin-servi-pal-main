import type { Metadata } from "next";
import SupportContent from "@/components/support-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://admin.servi-pal.com";

export const metadata: Metadata = {
  title: "Contact Support — ServiPal",
  description: "Get help with ServiPal. Contact our support team for assistance with orders, payments, deliveries, and more.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Contact Support — ServiPal",
    description: "Get help with ServiPal. Contact our support team for assistance with orders, payments, and deliveries.",
    url: `${siteUrl}/support`,
    siteName: "ServiPal",
    type: "website",
  },
};

export default function SupportPage() {
  return <SupportContent />;
}
