"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Target, Sparkles, Shield, Users, Zap } from "lucide-react";
import React from "react";

const AboutPage = () => {
  const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className="bg-primary/10 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  const ServiceItem = ({ number, title, description }: { number: string; title: string; description: string }) => (
    <li className="flex items-start">
      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-4 mt-1 flex-shrink-0">
        {number}
      </span>
      <div>
        <strong className="text-lg">{title}</strong>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </li>
  );

  return (
    <div className="">
      <Card className="text-card-foreground px-2 shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center">About Us</CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Connecting Nigeria, One Service at a Time
          </p>
        </CardHeader>
        
        <CardContent className="max-w-4xl mx-auto space-y-12">
          {/* MohStack Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Our Parent Company: MohStack</h2>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              ServiPal is proudly developed and operated by <strong className="text-foreground">MohStack</strong>, 
              a leading software and app development company dedicated to creating innovative digital solutions 
              that transform how people live and do business in Nigeria.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              MohStack specializes in building cutting-edge mobile and web applications that solve real-world 
              problems. With expertise in custom software development, our team combines technical excellence 
              with deep market understanding to create platforms that truly serve African communities. Our 
              commitment to quality, security, and user experience drives everything we build.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              From enterprise solutions to consumer-facing apps, MohStack is positioning itself as a trusted 
              technology partner, delivering scalable, reliable, and innovative software products. ServiPal, 
              our flagship mobile app, represents our vision of leveraging technology to connect people, 
              empower businesses, and simplify everyday life across Nigeria.
            </p>
          </section>

          <div className="border-t pt-12"></div>

          {/* ServiPal Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">About ServiPal</h2>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              ServiPal is Nigeria's trusted multi-vendor lifestyle app that brings together customers and 
              service providers on a single, secure platform. We're revolutionizing how Nigerians access 
              everyday services by making food delivery, parcel logistics, laundry services, and online 
              shopping seamlessly available in one convenient app.
            </p>
          </section>

          {/* Mission Section */}
          <section className="bg-primary/5 p-6 rounded-lg border space-y-4">
            <div className="flex items-center space-x-3">
              <Target className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We exist to simplify daily life for customers while empowering local businesses to grow. 
              By connecting verified vendors with thousands of active users across Nigeria, we're building 
              a thriving ecosystem where convenience meets opportunity.
            </p>
          </section>

          {/* What We Do */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">What We Do</h2>
            
            <p className="text-muted-foreground leading-relaxed">
              ServiPal operates as an all-in-one marketplace where customers can access multiple essential 
              services while vendors can reach a wider audience and grow their revenue. Our platform serves 
              two key audiences:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <Users className="w-5 h-5 text-primary mr-2" />
                  For Customers
                </h3>
                <p className="text-muted-foreground text-sm">
                  Browse hundreds of trusted vendors offering meals, laundry services, delivery options, 
                  and products—all verified and reviewed for your peace of mind. Enjoy secure payments, 
                  real-time tracking, and the convenience of managing all your lifestyle needs in one place.
                </p>
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <Zap className="w-5 h-5 text-primary mr-2" />
                  For Vendors
                </h3>
                <p className="text-muted-foreground text-sm">
                  Expand your business reach, manage orders efficiently, and receive secure payments through 
                  our escrow-protected system. Whether you're a restaurant owner, dispatch rider, laundry 
                  service provider, or online seller, ServiPal gives you the tools and customer base to succeed.
                </p>
              </div>
            </div>
          </section>

          {/* Core Services */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Our Core Services</h2>
            
            <ol className="space-y-6">
              <ServiceItem 
                number="1"
                title="Food Delivery"
                description="Order from multiple restaurants in your city with fast, affordable delivery to your doorstep."
              />
              <ServiceItem 
                number="2"
                title="Logistics & Delivery"
                description="Send or receive packages through our network of trusted dispatch riders with full tracking and proof of delivery."
              />
              <ServiceItem 
                number="3"
                title="Laundry Services"
                description="Book convenient pick-up and delivery from verified laundry vendors without leaving your home."
              />
              <ServiceItem 
                number="4"
                title="Peer-to-Peer Marketplace"
                description="Buy and sell safely with our escrow-protected payment system that holds funds until you confirm satisfaction."
              />
            </ol>
          </section>

          {/* Why Choose Us */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Why Businesses Choose Us</h2>
            
            <p className="text-muted-foreground leading-relaxed">
              We offer vendors more than just a platform—we provide a complete business solution with free 
              registration, a custom dashboard for managing operations, secure payment processing, in-app 
              customer messaging, and the visibility needed to build a strong reputation through ratings 
              and reviews. With ServiPal, vendors focus on delivering great service while we handle the 
              technology, payments, and customer connections.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <FeatureCard 
                icon={Shield}
                title="Trust & Security"
                description="Every vendor is verified, all payments are protected through our escrow system, and every transaction is transparent."
              />
              <FeatureCard 
                icon={Target}
                title="Nationwide Coverage"
                description="Available across Nigeria and continuously expanding to serve more communities."
              />
              <FeatureCard 
                icon={Zap}
                title="MohStack-Powered"
                description="Backed by world-class development practices, robust security infrastructure, and continuous platform improvements."
              />
              <FeatureCard 
                icon={Users}
                title="Growing Community"
                description="Join thousands of customers and vendors already thriving on the ServiPal platform."
              />
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-primary/10 p-8 rounded-lg border-2 border-primary/20 text-center space-y-4">
            <h2 className="text-2xl font-bold">Join the ServiPal Community</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're looking for convenient access to everyday services or seeking to grow your 
              business, ServiPal is your partner for success. Download the app today and experience the 
              future of lifestyle services in Nigeria.
            </p>
            <p className="text-sm text-muted-foreground italic mt-6">
              ServiPal - A MohStack Product
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
