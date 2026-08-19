import type { Metadata } from "next";
import FAQContent from "@/components/faq-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://servi-pal.com";

export const metadata: Metadata = {
  title: "FAQs — ServiPal Help Center",
  description: "Frequently asked questions about ServiPal — food ordering, package delivery, laundry services, marketplace, payments, and account security.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "FAQs — ServiPal Help Center",
    description: "Frequently asked questions about ServiPal — food ordering, delivery, laundry, marketplace, and payments.",
    url: `${siteUrl}/faqs`,
    siteName: "ServiPal",
    type: "website",
  },
};

export default function FAQPage() {
  return <FAQContent />;
}
