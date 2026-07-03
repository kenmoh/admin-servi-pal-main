"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
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

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          // Unique violation
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
        {/* Decorative Background Element */}
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
              From deliveries to food, laundry to marketplace;
              <br />
              <span className="bg-linear-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                manage it all from one unified app
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
              From sending packages to ordering food, cleaning clothes to buying
              and selling — ServiPal handles your daily needs in one easy app.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start pt-4">
              <Link
                href="https://play.google.com/store"
                className="rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-accent/5"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-14"
                />
              </Link>
              <a
                href="https://www.apple.com/app-store/"
                className="rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all active:scale-95 shadow-lg shadow-black/5"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-14"
                />
              </a>
            </div>
          </div>

          <div className="relative group lg:ml-auto">
            <div className="absolute -inset-4 bg-linear-to-tr from-accent/20 to-transparent rounded-3xl blur-2xl group-hover:opacity-75 transition duration-500 opacity-50" />
            <div className="relative overflow-hidden rounded-3xl border border-border/50 shadow-2xl">
              <Image
                src="/header_images.png"
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
          <FlowSection aria-label="Swift Delivery" style={{ backgroundColor: '#ff8c00', color: '#fff' }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">01 — Swift Delivery</p>
            <hr className="my-[2vw] border-none border-t border-black opacity-100" />
            <div className="flex items-center gap-4">
              <Bike className="w-12 h-12" />
              <h1 className="text-[clamp(3rem,10vw,12rem)] font-bold leading-[0.85] uppercase tracking-tight">
                Fast
                <br />
                & Reliable
              </h1>
            </div>
            <hr className="my-[2vw] border-none border-t border-black opacity-100" />
            <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
              From documents to gifts, our registered dispatch riders deliver it all with lightning speed across the city.
            </p>
            <hr className="my-[2vw] border-none border-t border-black opacity-100" />
            <div className="flex flex-wrap gap-[3vw]">
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Real-time Tracking</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Follow your package every step of the way with live GPS updates.
                </p>
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Professional Riders</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Registered and verified dispatch riders you can trust.
                </p>
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Instant Insurance</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Every package is automatically insured for your peace of mind.
                </p>
              </div>
            </div>
          </FlowSection>

          <FlowSection aria-label="Food on Demand" style={{ backgroundColor: '#000', color: '#fff' }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">02 — Food on Demand</p>
            <hr className="my-[2vw] border-none border-t border-white/60" />
            <div className="flex items-center gap-4">
              <Utensils className="w-12 h-12" />
              <h2 className="text-[clamp(3rem,10vw,12rem)] font-bold leading-[0.85] uppercase tracking-tight">
                Crave
                <br />
                & Order
              </h2>
            </div>
            <hr className="my-[2vw] border-none border-t border-white/60" />
            <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
              Craving Jollof rice or Pizza? Your favourite restaurants are just a tap away.
            </p>
            <hr className="my-[2vw] border-none border-t border-white/60" />
            <div className="flex flex-wrap gap-[3vw]">
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Wide Variety</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Multiple cuisines from local favourites to international dishes.
                </p>
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Fast Delivery</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Quick and reliable order fulfillment to your doorstep.
                </p>
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Flexible Options</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Choose pickup or delivery based on vendor availability.
                </p>
              </div>
            </div>
            <hr className="my-[2vw] border-none border-t border-white/60" />
            <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
              Seamless ordering experience from start to finish. Your food, your way.
            </p>
          </FlowSection>

          <FlowSection aria-label="Pristine Laundry" style={{ backgroundColor: '#F5F0E8', color: '#000' }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">03 — Pristine Laundry</p>
            <hr className="my-[2vw] border-none border-t border-black/60" />
            <div className="flex items-center gap-4">
              <Shirt className="w-12 h-12" />
              <h2 className="text-[clamp(3rem,10vw,12rem)] font-bold leading-[0.85] uppercase tracking-tight">
                Fresh
                <br />
                & Clean
              </h2>
            </div>
            <hr className="my-[2vw] border-none border-t border-black/60" />
            <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
              Say goodbye to laundry day stress. Our providers will keep your wardrobe fresh.
            </p>
            <hr className="my-[2vw] border-none border-t border-black/60" />
            <div className="flex flex-wrap gap-[3vw]">
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Pickup & Delivery</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  We collect and return your laundry at your convenience.
                </p>
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Premium Dry Cleaning</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Professional care for your delicate fabrics and special garments.
                </p>
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Eco-Friendly</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Using environmentally safe detergents that are gentle on clothes.
                </p>
              </div>
            </div>
          </FlowSection>

          <FlowSection aria-label="Secure Shopping" style={{ backgroundColor: '#1A3DE8', color: '#fff' }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">04 — Secure Shopping</p>
            <hr className="my-[2vw] border-none border-t border-white/50" />
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-12 h-12" />
              <h2 className="text-[clamp(3rem,10vw,12rem)] font-bold leading-[0.85] uppercase tracking-tight">
                Shop
                <br />
                & Save
              </h2>
            </div>
            <hr className="my-[2vw] border-none border-t border-white/50" />
            <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
              Shop with peace of mind. Our escrow service ensures your money is safe until you&apos;re satisfied.
            </p>
            <hr className="my-[2vw] border-none border-t border-white/50" />
            <div className="flex flex-wrap gap-[3vw]">
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Secure Escrow</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Your payment is held safely until you confirm delivery.
                </p>
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Multiple Sellers</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Access to a wide range of sellers across various categories.
                </p>
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">Easy Returns</p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  Hassle-free return policy if you&apos;re not completely satisfied.
                </p>
              </div>
            </div>
            <hr className="my-[2vw] border-none border-t border-white/50" />
            <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
              Buy and sell with confidence. Your transactions, protected.
            </p>
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
              © {date} ServiPal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
