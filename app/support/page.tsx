"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, Phone, Clock, MapPin, Send } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you for contacting us! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const ContactCard = ({
    icon: Icon,
    title,
    content,
    link,
  }: {
    icon: any;
    title: string;
    content: string;
    link?: string;
  }) => (
    <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card hover:shadow-md hover:border-primary/30 transition-all">
      <div className="bg-primary/10 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        {link ? (
          <a
            href={link}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {content}
          </a>
        ) : (
          <p className="text-muted-foreground">{content}</p>
        )}
      </div>
    </div>
  );

  const supportCategories = [
    "Account Issues",
    "Payment & Refunds",
    "Food Delivery",
    "Package Delivery",
    "Laundry Services",
    "Marketplace",
    "Technical Issues",
    "Vendor Inquiries",
    "Other",
  ];

  return (
    <div className="">
      <Card className="text-card-foreground px-2 shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center">
            Support Center
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            We're here to help! Reach out to us and we'll respond as soon as
            possible.
          </p>
        </CardHeader>

        <CardContent className="max-w-6xl mx-auto space-y-12">
          {/* Contact Methods */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Get In Touch</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ContactCard
                icon={Mail}
                title="Email Support"
                content="support@servi-pal.com"
                link="mailto:support@servipal.com"
              />
              <ContactCard
                icon={Phone}
                title="Phone Support"
                content="+234 907345335"
                link="tel:+2349074345335"
              />
              <ContactCard
                icon={MessageCircle}
                title="Live Chat"
                content="Available in the app"
              />
              <ContactCard
                icon={Clock}
                title="Support Hours"
                content="Mon - Sat: 8AM - 8PM WAT"
              />
              <ContactCard
                icon={MapPin}
                title="Office Location"
                content="Lagos, Nigeria"
              />
              <ContactCard
                icon={Mail}
                title="Business Inquiries"
                content="business@servipal.com"
                link="mailto:business@servipal.com"
              />
            </div>
          </section>

          {/* Contact Form */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24
                hours
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a category</option>
                  {supportCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject <span className="text-destructive">*</span>
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Brief description of your issue"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Please provide as much detail as possible about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="resize-none"
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By submitting this form, you agree to our Privacy Policy and
                Terms of Service
              </p>
            </form>
          </section>

          {/* Quick Help Section */}
          <section className="mt-12 p-8 bg-primary/5 rounded-lg border-2 border-primary/20 space-y-4">
            <h3 className="text-2xl font-bold text-center">
              Looking for Quick Answers?
            </h3>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Many common questions are answered in our FAQ section. Check it
              out before reaching out!
            </p>
            <div className="flex justify-center mt-6">
              <a
                href="/faqs"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Visit FAQ Page
              </a>
            </div>
          </section>

          {/* Vendor Support */}
          {/*   <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Vendor Support</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Are you a current or prospective vendor? We have dedicated
                support for business partners.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="p-6 rounded-lg border bg-card text-center space-y-3">
                <h3 className="font-bold text-lg">New Vendors</h3>
                <p className="text-sm text-muted-foreground">
                  Interested in joining ServiPal as a vendor? Learn about our
                  onboarding process.
                </p>
                <Button variant="outline" className="mt-4">
                  Become a Vendor
                </Button>
              </div>

              <div className="p-6 rounded-lg border bg-card text-center space-y-3">
                <h3 className="font-bold text-lg">Existing Vendors</h3>
                <p className="text-sm text-muted-foreground">
                  Need help with your vendor account or have questions about
                  operations?
                </p>
                <Button variant="outline" className="mt-4">
                  Vendor Portal
                </Button>
              </div>
            </div>
          </section>*/}

          {/* Response Time Notice */}
          <section className="bg-accent/20 border border-border/30 rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">
                Average Response Time:
              </strong>{" "}
              We typically respond to support requests within 4-6 hours during
              business hours. For urgent issues, please call our phone support
              line or use the in-app live chat feature.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportPage;
