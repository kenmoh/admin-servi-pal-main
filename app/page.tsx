'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Check,
  Package,
  Utensils,
  WashingMachine,
  Handshake,

  LogIn,

} from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  const [email, setEmail] = useState('');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const services = [
    {
      icon: <Package className="h-8 w-8 text-primary" />,
      title: "Item Delivery",
      description: "Fast and reliable package delivery services with real-time tracking and secure handling."
    },
    {
      icon: <Utensils className="h-8 w-8 text-primary" />,
      title: "Food Ordering",
      description: "Order delicious meals from local restaurants with quick delivery and special offers."
    },
    {
      icon: <WashingMachine className="h-8 w-8 text-primary" />,
      title: "Laundry Service",
      description: "Convenient laundry pickup and delivery with professional cleaning and care for all fabrics."
    },
    {
      icon: <Handshake className="h-8 w-8 text-primary" />,
      title: "P2P Marketplace",
      description: "Connect directly with local service providers and buyers in a secure peer-to-peer environment."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col dark">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-sm bg-background/80 border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/mainicon.png"
              alt="ServiPal Logo"
              className="h-10 w-10"
            />
            <div className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-brand-orange to-brand-blue">
              ServiPal
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('services')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </button>
          </nav>
          <div className="flex items-center gap-3">

            <Link href='/login'>
              <Button>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>

          </div>
        </div>
      </header>

      {/* Hero Section  HERE*/}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-background to-brand-blue/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Tagline and Download Buttons */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-orange">
                    All Your Services
                  </span>
                  <br />
                  <span className="text-foreground">In One App</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  From food delivery to laundry services, we bring everything you need right to your doorstep.
                  Fast, reliable, and convenient.
                </p>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://play.google.com/store"
                  className="bg-gray-800 p-3 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
                </a>
                <a
                  href="https://www.apple.com/app-store/"
                  className="bg-gray-800 p-3 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" />
                </a>
              </div>
            </div>

            {/* Right Column - Mini Browser Dashboard */}
            <div className="relative">
              <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/30 p-6">
                {/* Browser Header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 bg-muted rounded-md px-3 py-1 text-sm text-muted-foreground">
                    ServiPal Dashboard
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Services Overview</h3>
                    <div className="text-sm text-muted-foreground">Live</div>
                  </div>

                  {/* Service Cards */}
                  <div className="grid grid-cols-1 gap-4">
                    {/* Delivery Service */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg p-4 border border-blue-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-500/20 p-2 rounded-lg">
                            <Package className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-medium">Item Delivery</div>
                            <div className="text-sm text-muted-foreground">Active orders</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-500">1,247</div>
                          <div className="text-xs text-green-500">+12%</div>
                        </div>
                      </div>
                    </div>

                    {/* Food Ordering */}
                    <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg p-4 border border-orange-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-500/20 p-2 rounded-lg">
                            <Utensils className="h-5 w-5 text-orange-500" />
                          </div>
                          <div>
                            <div className="font-medium">Food Ordering</div>
                            <div className="text-sm text-muted-foreground">Active orders</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-500">892</div>
                          <div className="text-xs text-green-500">+8%</div>
                        </div>
                      </div>
                    </div>

                    {/* Laundry Service */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-500/20 p-2 rounded-lg">
                            <WashingMachine className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <div className="font-medium">Laundry Service</div>
                            <div className="text-sm text-muted-foreground">Active orders</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-500">456</div>
                          <div className="text-xs text-green-500">+15%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">2,595</div>
                      <div className="text-xs text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">98.5%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements for Blur Effect */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-brand-orange/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-brand-blue/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      < section id="services" className="py-20 bg-gradient-to-br from-brand-orange/5 to-brand-blue/5" >
        <div className="max-w-[75vw] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-orange">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We bring together essential services on one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative bg-background/60 backdrop-blur-sm rounded-lg p-6 shadow-lg hover-card transition-all group border border-border/30">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 p-3 rounded-full w-fit mb-4 shadow-sm border border-border/20">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* How It Works */}
      < section id="how-it-works" className="py-20" >
        <div className="max-w-[75vw] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-blue">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, fast and efficient - here's how our platform brings services to your doorstep
            </p>
          </div>

          <div className="space-y-12 md:space-y-24">
            {/* Service 1 - Item Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue/30 to-brand-orange/30 opacity-70 blur-xl rounded-xl"></div>
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/80 to-background flex items-center justify-center">
                      <Package className="w-24 h-24 text-primary/50" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold mb-4">Fast Package Delivery</h3>
                <p className="text-muted-foreground mb-6">
                  Get your packages delivered quickly and securely. From documents to large parcels, we handle it all with care.
                </p>
                <ul className="space-y-3">
                  {["Real-time tracking", "Secure handling", "Flexible delivery options", "Proof of delivery"].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="mr-3 mt-1 bg-primary/20 rounded-full p-1 shadow-sm border border-border/20">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Service 2 - Food Ordering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Delicious Food Delivery</h3>
                <p className="text-muted-foreground mb-6">
                  Order from your favorite local restaurants and enjoy hot, fresh meals delivered to your doorstep.
                </p>
                <ul className="space-y-3">
                  {["Wide restaurant selection", "Special offers and discounts", "Contactless delivery", "Easy reordering"].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="mr-3 mt-1 bg-primary/20 rounded-full p-1 shadow-sm border border-border/20">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange/30 to-brand-blue/30 opacity-70 blur-xl rounded-xl"></div>
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border/30">
                    <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/20 via-background/80 to-background flex items-center justify-center">
                      <Utensils className="w-24 h-24 text-primary/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service 3 - Laundry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue/30 to-primary/30 opacity-70 blur-xl rounded-xl"></div>
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-background/80 to-background flex items-center justify-center">
                      <WashingMachine className="w-24 h-24 text-primary/50" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold mb-4">Convenient Laundry Service</h3>
                <p className="text-muted-foreground mb-6">
                  Let us handle your laundry with professional care. Schedule pickups and deliveries that fit your busy schedule.
                </p>
                <ul className="space-y-3">
                  {["Professional cleaning", "Fabric-specific care", "Scheduled pickups", "Fast turnaround"].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="mr-3 mt-1 bg-primary/20 rounded-full p-1 shadow-sm border border-border/20">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Service 4 - P2P Marketplace */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">P2P Marketplace</h3>
                <p className="text-muted-foreground mb-6">
                  Connect directly with local service providers and sellers in a secure peer-to-peer marketplace.
                </p>
                <ul className="space-y-3">
                  {["Verified providers", "Secure transactions", "Rating system", "Direct communication"].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="mr-3 mt-1 bg-primary/20 rounded-full p-1 shadow-sm border border-border/20">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange/30 to-brand-blue/30 opacity-70 blur-xl rounded-xl"></div>
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border/30">
                    <div className="absolute inset-0 bg-gradient-to-bl from-green-500/20 via-background/80 to-background flex items-center justify-center">
                      <Handshake className="w-24 h-24 text-primary/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Testimonials */}
      {/* <section id="testimonials" className="py-20 bg-gradient-to-br from-brand-blue/5 to-brand-orange/5">
        <div className="max-w-[75vw] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-orange">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real experiences from people who use our services every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The food delivery is always on time and the food arrives hot. I use this app almost daily!",
                author: "Sarah Johnson",
                role: "Regular Customer"
              },
              {
                quote: "Their laundry service saved me so much time. The clothes come back perfectly clean and neatly folded.",
                author: "Michael Chen",
                role: "Premium Subscriber"
              },
              {
                quote: "I've found amazing local service providers through the marketplace. It's like having a trusted network at your fingertips.",
                author: "Jessica Miller",
                role: "Business Owner"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="relative bg-background/60 backdrop-blur-sm rounded-lg p-8 shadow-lg group border border-border/30">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="text-4xl font-serif text-primary">"</div>
                  <p className="my-4 italic">{testimonial.quote}</p>
                  <div className="mt-6">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* CTA Section with Download Buttons */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-brand-blue/5 -z-10"></div>
        <div className="absolute top-0 right-0 w-1/2 aspect-square rounded-full bg-gradient-to-br from-brand-orange/10 to-transparent blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/2 aspect-square rounded-full bg-gradient-to-tr from-brand-blue/10 to-transparent blur-3xl -z-10"></div>

        <div className="max-w-[75vw] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-orange">Ready to Simplify Your Life?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who are making their lives easier with our multi-service platform.
            </p>

            {/* Download buttons moved to hero section */}

            <div className="mt-12 p-8 bg-background/60 backdrop-blur-sm rounded-xl shadow-lg relative group border border-border/30">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <h3 className="text-xl font-bold mb-6">Stay Updated</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow bg-background/50 border-border/30"
                  />
                  <Button className="whitespace-nowrap">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  By subscribing, you agree to our Privacy Policy and receive updates from our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 border-t border-border/30">
        <div className="max-w-[75vw] mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">ServiPal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Press</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Item Delivery</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Food Ordering</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Laundry Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">P2P Marketplace</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQs</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Safety</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">© 2025 ServiPal. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default Home;
