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

  const features = [
    {
      icon: Bike,
      image: "/delivery.png",
      title: "Swift Delivery",
      description:
        "From documents to gifts, our registered dispatch riders deliver it all with lightning speed.",
      points: [
        "Real-time tracking",
        "Registered professional riders",
        "Instant package insurance",
        "Door-to-door fulfillment"
      ]
    },
    {
      icon: Utensils,
      image: "/food.png",
      title: "Food on Demand",
      description:
        "Craving Jollof rice or Pizza? Your favourite restaurants are just a tap away.",
      points: [
        "Wide variety of cuisines",
        "Fastest delivery times",
        "Group order discounts",
        "Schedule future meals"
      ]
    },
    {
      icon: Shirt,
      image: "/laundry.png",
      title: "Pristine Laundry",
      description:
        "Say goodbye to laundry day stress. Our providers will keep your wardrobe fresh.",
      points: [
        "Pickup and delivery",
        "Premium dry cleaning",
        "Eco-friendly detergents",
        "Stain removal experts"
      ]
    },
    {
      icon: ShoppingBag,
      image: "/marketplace.png",
      title: "Secure Shopping",
      description:
        "Shop with peace of mind. Our escrow service ensures your money is safe until you're satisfied.",
      points: [
        "Verified seller network",
        "Secure escrow payment",
        "Multi-category catalog",
        "Easy return policy"
      ]
    },
  ];

  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Daily Transactions", value: "100K+" },
    { label: "Platform Coverage", value: "4 Services" },
    { label: "Uptime", value: "99.9%" },
  ];

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
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        
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

      {/* Features Section */}
      <section className="py-24 px-6 bg-linear-to-b from-card/30 to-background border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Services You Control</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              One app. Four powerful services. Total convenience at your fingertips.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group relative flex flex-col md:flex-row gap-8 p-4 rounded-3xl border border-border/50 bg-background/50 hover:bg-card transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 overflow-hidden"
                >
                  <div className="md:w-1/2 relative overflow-hidden rounded-2xl aspect-4/3 md:aspect-auto h-64 md:h-full min-h-[300px]">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-contain transform transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 py-4 md:py-6 pr-4 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <h3 className="font-bold text-2xl tracking-tight">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    <ul className="grid grid-cols-1 gap-3 pt-2">
                      {feature.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="group/btn rounded-full border-accent/20 hover:bg-accent/10 hover:border-accent">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
