import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/lib/context";
import { QueryProvider } from "@/components/query-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://admin.servi-pal.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ServiPal Admin Dashboard",
    template: "%s | ServiPal Admin",
  },
  description:
    "Comprehensive admin dashboard for managing delivery, food ordering, laundry services, and P2P marketplace operations with real-time analytics and monitoring.",
  keywords: [
    "admin dashboard",
    "delivery management",
    "food ordering",
    "laundry services",
    "marketplace",
    "ServiPal",
    "analytics",
    "order management",
  ],
  authors: [{ name: "ServiPal" }],
  creator: "ServiPal",
  publisher: "ServiPal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ServiPal Admin",
    title: "ServiPal Admin Dashboard",
    description:
      "Comprehensive admin dashboard for managing delivery, food ordering, laundry services, and P2P marketplace operations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ServiPal Admin Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ServiPal Admin Dashboard",
    description:
      "Comprehensive admin dashboard for managing delivery, food ordering, laundry services, and P2P marketplace operations.",
    images: ["/og-image.png"],
    creator: "@servipal",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: {
    icon: "/mainicon.png",
    shortcut: "/mainicon.png",
    apple: "/mainicon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            <AppProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </AppProvider>
          </QueryProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
