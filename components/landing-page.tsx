"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Github,
  Twitter,
  Linkedin,
  CheckCircle2,
  Bike,
  Utensils,
  Shirt,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { supabase } from "@/supabase/supabase";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { OrganizationJsonLd, WebSiteJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://admin.servi-pal.com";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // TODO: Uncomment when metrics are available in Supabase
  // Also re-add imports: import { Store, Package, MapPin } from "lucide-react";
  // const [metrics, setMetrics] = useState({ vendors: 0, orders: 0, cities: 0 });
  //
  // useEffect(() => {
  //   async function fetchMetrics() {
  //     try {
  //       const [vendors, orders, cities] = await Promise.all([
  //         supabase.from("restaurants").select("id", { count: "exact", head: true }),
  //         supabase.from("transactions").select("id", { count: "exact", head: true }),
  //         supabase.from("restaurants").select("city", { count: "exact" }),
  //       ]);
  //       const uniqueCities = new Set(
  //         (cities.data || []).map((r: any) => r.city).filter(Boolean)
  //       );
  //       setMetrics({
  //         vendors: vendors.count || 0,
  //         orders: orders.count || 0,
  //         cities: uniqueCities.size || 0,
  //       });
  //     } catch { /* silent */ }
  //   }
  //   fetchMetrics();
  // }, []);

  const date = new Date().getFullYear();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("email_subscribers")
        .insert([{ email }]);

      if (error) {
        if (error.code === "23505") {
          alert("This email is already subscribed!");
        } else {
          throw error;
        }
      } else {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => {
          setSubscribed(false);
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error subscribing:", error);
      alert(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
      <OrganizationJsonLd
        name="ServiPal"
        description="Multi-vendor lifestyle application for food ordering, delivery, laundry services, and P2P marketplace."
        url={siteUrl}
        image={`${siteUrl}/og-image.png`}
        sameAs={[
          "https://twitter.com/servipal",
          "https://linkedin.com/company/servipal",
          "https://github.com/servipal",
        ]}
      />
      <WebSiteJsonLd
        name="ServiPal"
        description="Multi-vendor lifestyle application for food ordering, delivery, laundry services, and P2P marketplace."
        url={siteUrl}
        image={`${siteUrl}/og-image.png`}
      />
      <ServiceJsonLd
        name="Food Ordering"
        description="Order meals from your favourite restaurants and get them delivered. Jollof rice, pizza, and more at your doorstep."
        url={`${siteUrl}#food`}
        serviceType="Food Ordering"
      />
      <ServiceJsonLd
        name="Package Delivery"
        description="Send documents, parcels, and gifts across the city with real-time tracking and registered dispatch riders."
        url={`${siteUrl}#delivery`}
        serviceType="Package Delivery"
      />
      <ServiceJsonLd
        name="Laundry Service"
        description="Professional laundry pickup and delivery. Premium dry cleaning, eco-friendly detergents, and stain removal experts."
        url={`${siteUrl}#laundry`}
        serviceType="Laundry Service"
      />
      <ServiceJsonLd
        name="Online Marketplace"
        description="Shop with confidence using our escrow-protected P2P marketplace. Buy and sell safely across Nigeria."
        url={`${siteUrl}#marketplace`}
        serviceType="Online Marketplace"
      />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
                src="/mainicon.png"
                alt="ServiPal Logo"
                width={32}
                height={32}
              />
            </div>
            <span className="font-bold text-lg">ServiPal</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/about">
              <Button variant="ghost" size="sm">
                About
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="ghost" size="sm">
                Privacy
              </Button>
            </Link>
            <Link href="/terms-of-service">
              <Button size="sm" className=":bg-accent/90" variant={"ghost"}>
                Terms
              </Button>
            </Link>
            <Link href="/faqs">
              <Button
                size="sm"
                className="hover:bg-accent/90"
                variant={"ghost"}
              >
                FAQs
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-125 h-125 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              The All-in-One Everyday App
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Food ordering, package dispatch, laundry &amp; shopping
              <br />
              <span className="bg-linear-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                all in one app
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
              Order meals from top restaurants, send parcels across the city,
              get your laundry picked up, and shop safely with escrow
              protection — ServiPal handles your daily needs in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start pt-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.servipal.app"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-accent/5"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get ServiPal on Google Play"
                  className="h-14"
                />
              </a>
              <a
                href="https://apps.apple.com/app/servipal/id000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-black/5"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download ServiPal on the App Store"
                  className="h-14"
                />
              </a>
            </div>
          </div>

          <div className="relative group lg:ml-auto">
            <div className="absolute -inset-4 bg-linear-to-tr from-accent/20 to-transparent rounded-3xl blur-2xl group-hover:opacity-75 transition duration-500 opacity-50" />
            <div className="relative overflow-hidden rounded-3xl border border-border/50 shadow-2xl">
              <Image
                src="/optimized/header_images.webp"
                alt="ServiPal App Interface"
                width={600}
                height={600}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics — uncomment when data is available
      <section className="py-12 px-6 border-y border-border/50 bg-card/30">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center">
              <Store className="w-8 h-8 text-accent" />
            </div>
            <p className="text-3xl md:text-4xl font-bold">{metrics.vendors}+</p>
            <p className="text-sm text-muted-foreground">Active Vendors</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center">
              <Package className="w-8 h-8 text-accent" />
            </div>
            <p className="text-3xl md:text-4xl font-bold">{metrics.orders.toLocaleString()}+</p>
            <p className="text-sm text-muted-foreground">Orders Delivered</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center">
              <MapPin className="w-8 h-8 text-accent" />
            </div>
            <p className="text-3xl md:text-4xl font-bold">{metrics.cities}+</p>
            <p className="text-sm text-muted-foreground">Cities Covered</p>
          </div>
        </div>
      </section>
      */}

      {/* Services You Control - FlowArt Scroll Section */}
      <section className="py-24 px-6 bg-linear-to-b from-card/30 to-background border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Services You Control</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              One app. Four powerful services. Total convenience at your fingertips.
            </p>
          </div>
        </div>

        <FlowArt aria-label="ServiPal Services">
          {/* Swift Delivery */}
          <FlowSection aria-label="Swift Delivery" style={{ backgroundColor: '#ff8c00', color: '#fff' }}>
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Bike className="w-7 h-7" />
            </div>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 items-center">
              <div className="flex-1 space-y-6">
                <h2 className="text-[clamp(3rem,10vw,12rem)] font-bold leading-[0.85] uppercase tracking-tight">
                  Fast
                  <br />
                  & Reliable
                </h2>
                <p className="max-w-[45ch] text-[clamp(1rem,2vw,1.5rem)] leading-relaxed opacity-90">
                  From documents to gifts, our registered dispatch riders deliver it all with lightning speed.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Real-time tracking",
                    "Registered professional riders",
                    "Instant package insurance",
                    "Door-to-door fulfillment",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative w-full lg:w-[340px] shrink-0">
                <Image
                  src="/optimized/delivery.webp"
                  alt="ServiPal Delivery App"
                  width={340}
                  height={600}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </FlowSection>

          {/* Food on Demand */}
          <FlowSection aria-label="Food on Demand" style={{ backgroundColor: '#111', color: '#fff' }}>
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Utensils className="w-7 h-7" />
            </div>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 items-center">
              <div className="flex-1 space-y-6">
                <h2 className="text-[clamp(3rem,10vw,12rem)] font-bold leading-[0.85] uppercase tracking-tight">
                  Crave
                  <br />
                  & Order
                </h2>
                <p className="max-w-[45ch] text-[clamp(1rem,2vw,1.5rem)] leading-relaxed opacity-90">
                  Craving Jollof rice or Pizza? Your favourite restaurants are just a tap away.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Wide variety of cuisines",
                    "Fast and reliable order fulfillment",
                    "Flexible pickup or delivery options",
                    "Seamless ordering experience",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative w-full lg:w-[340px] shrink-0">
                <Image
                  src="/optimized/food.webp"
                  alt="ServiPal Food Ordering App"
                  width={340}
                  height={600}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </FlowSection>

          {/* Pristine Laundry */}
          <FlowSection aria-label="Pristine Laundry" style={{ backgroundColor: '#F5F0E8', color: '#000' }}>
            <div className="w-14 h-14 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Shirt className="w-7 h-7" />
            </div>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 items-center">
              <div className="flex-1 space-y-6">
                <h2 className="text-[clamp(3rem,10vw,12rem)] font-bold leading-[0.85] uppercase tracking-tight">
                  Fresh
                  <br />
                  & Clean
                </h2>
                <p className="max-w-[45ch] text-[clamp(1rem,2vw,1.5rem)] leading-relaxed opacity-80">
                  Say goodbye to laundry day stress. Our providers will keep your wardrobe fresh.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Pickup and delivery",
                    "Premium dry cleaning",
                    "Eco-friendly detergents",
                    "Stain removal experts",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative w-full lg:w-[340px] shrink-0">
                <Image
                  src="/optimized/laundry.webp"
                  alt="ServiPal Laundry App"
                  width={340}
                  height={600}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </FlowSection>

          {/* Secure Shopping */}
          <FlowSection aria-label="Secure Shopping" style={{ backgroundColor: '#1A3DE8', color: '#fff' }}>
            <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 items-center">
              <div className="flex-1 space-y-6">
                <h2 className="text-[clamp(3rem,10vw,12rem)] font-bold leading-[0.85] uppercase tracking-tight">
                  Shop
                  <br />
                  & Save
                </h2>
                <p className="max-w-[45ch] text-[clamp(1rem,2vw,1.5rem)] leading-relaxed opacity-90">
                  Shop with peace of mind. Our escrow service ensures your money is safe until you&apos;re satisfied.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Access to multiple sellers across categories",
                    "Secure escrow payment",
                    "Multi-category catalog",
                    "Easy return policy",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative w-full lg:w-[340px] shrink-0">
                <Image
                  src="/optimized/marketplace.webp"
                  alt="ServiPal Marketplace App"
                  width={340}
                  height={600}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </FlowSection>
        </FlowArt>
      </section>

      {/* Stay Updated Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Stay Updated</h2>
          <p className="text-muted-foreground">
            Get the latest updates on features and platform improvements
            delivered to your inbox
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex gap-2 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
            </Button>
          </form>

          {subscribed && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 justify-center mt-4">
              <CheckCircle2 className="w-5 h-5" />
              <span>Thanks for subscribing!</span>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Image
                    src="/mainicon.png"
                    alt="ServiPal Logo"
                    width={32}
                    height={32}
                  />
                </div>
                <span className="font-bold">ServiPal</span>
              </div>
            
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faqs"
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deleted-account"
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    Delete Account
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-card border border-border hover:border-accent/50 flex items-center justify-center transition"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-card border border-border hover:border-accent/50 flex items-center justify-center transition"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-card border border-border hover:border-accent/50 flex items-center justify-center transition"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row  items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {date} ServiPal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
