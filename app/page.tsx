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
} from "lucide-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const date = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  const features = [
    {
      icon: Bike,
      title: "Swift Delivery",
      description:
        "From documents to gifts, our registered dispatch riders deliver it all with lightning speed. Your items, our priority.",
    },
    {
      icon: Utensils,
      title: "Food on Demand",
      description:
        "Craving Jollof rice or Pizza? Your favourite restaurants are just a tap away. Bon appétit!",
    },
    {
      icon: Shirt,
      title: "Pristine Laundry",
      description:
        "Say goodbye to laundry day stress. Our laundry services providers will keep your wardrobe fresh and fabulous.",
    },
    {
      icon: ShoppingBag,
      title: "Secure Shopping",
      description:
        "Shop with peace of mind. Our escrow service ensures your money is safe until you're satisfied. What you ordered is what you get! 😊",
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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            From deliveries to food, laundry to marketplace
            <br />
            <span className="bg-linear-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
              — manage it all from one unified app
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From sending packages to ordering food, cleaning clothes to buying
            and selling — ServiPal handles your daily needs in one easy app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://play.google.com/store"
              className="rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-12"
              />
            </Link>
            <a
              href="https://www.apple.com/app-store/"
              className="rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                className="h-12"
              />
            </a>
          </div>

          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-card border border-border/50 hover:border-accent/30 transition"
              >
                <p className="text-2xl font-bold text-accent">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Services You Control</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              One app. Every service. Total convenience at your fingertips.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-6 rounded-xl border border-border/50 hover:border-accent/30 bg-background/50 hover:bg-card transition duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
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
            <Button type="submit" className="bg-accent hover:bg-accent/90">
              <Mail className="w-4 h-4" />
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
              {/* <p className="text-sm text-muted-foreground">
                Enterprise-grade multi-vendor dashboard
              </p> */}
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
