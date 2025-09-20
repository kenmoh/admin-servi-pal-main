"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sections = [
  { id: "eligibility", title: "Eligibility" },
  { id: "scope", title: "Scope of Services" },
  { id: "accounts", title: "User Accounts" },
  { id: "payments", title: "Payments & Refunds" },
  { id: "responsibilities", title: "Responsibilities of Users" },
  { id: "delivery", title: "Delivery, Food & Laundry Services" },
  { id: "marketplace", title: "Marketplace Transactions" },
  { id: "intellectual", title: "Intellectual Property" },
  { id: "disclaimers", title: "Disclaimers & Limitation of Liability" },
  { id: "termination", title: "Termination" },
  { id: "governing", title: "Governing Law & Dispute Resolution" },
  { id: "changes", title: "Changes to Terms" },
];

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState("eligibility");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; 
      let currentSectionId = sections[0].id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSectionId = section.id;
        }
      }
      setActiveSection(currentSectionId);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run on initial load
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const SidebarContent = () => (
    <div className="sticky top-20">
      <h3 className="text-lg font-semibold mb-4">Sections</h3>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => {
                setIsSheetOpen(false)
                setTimeout(() => {
                  const element = document.getElementById(section.id);
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 100, 
                      behavior: 'smooth',
                    });
                  }
                }, 0);
              }}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  const ListItem = ({ children }: {children: React.ReactNode}) => (
    <li className="flex items-start">
      <CheckCircle className="text-primary w-5 h-5 mr-3 mt-1 flex-shrink-0" />
      <div>{children}</div>
    </li>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
            <CardTitle className="text-3xl font-bold text-center flex-grow">Terms & Conditions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-12">
          <aside className="hidden md:block md:col-span-3">
            <SidebarContent />
          </aside>
          <main className="col-span-12 md:col-span-9">
            {/* <p className="text-muted-foreground mb-6">Effective Date: [Insert Date]</p>
            <p className="text-muted-foreground mb-6">Last Updated: [Insert Date]</p> */}
            
            <p className="mb-6">
              Welcome to ServiPal ("Company," "we," "our," "us"). By downloading, accessing, or using
              our mobile application, website, or services (the "App"), you ("user," "customer," or "service
              provider") agree to these Terms & Conditions ("Terms"). If you do not agree, please do not
              use ServiPal.
            </p>

            <section id="eligibility" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Eligibility</h2>
              <ul className="space-y-4">
                <ListItem><p>You must be at least 18 years old to use ServiPal.</p></ListItem>
                <ListItem><p>By registering, you confirm the information you provide is accurate and complete.</p></ListItem>
                <ListItem><p>Accounts may be suspended or terminated for violations of these Terms.</p></ListItem>
              </ul>
            </section>

            <section id="scope" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Scope of Services</h2>
              <p className="mb-4">ServiPal provides an integrated platform offering:</p>
              <ol className="space-y-4 mb-6">
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1 flex-shrink-0">1</span>
                  <div><strong>Swift Delivery</strong> – connecting customers with dispatch riders for secure item delivery.</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1 flex-shrink-0">2</span>
                  <div><strong>Food on Demand</strong> – enabling restaurant orders and home/office food delivery.</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1 flex-shrink-0">3</span>
                  <div><strong>Laundry Services</strong> – scheduling laundry pickup, cleaning, and delivery.</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1 flex-shrink-0">4</span>
                  <div><strong>Peer-to-Peer Marketplace</strong> – facilitating buying and selling of goods with escrow protection.</div>
                </li>
              </ol>
              <p className="mb-4">
                We act solely as an intermediary platform. We are not the provider of goods/services listed
                by third parties and assume no responsibility for the quality, safety, or legality of such
                services.
              </p>
            </section>

            <section id="accounts" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">User Accounts</h2>
              <ul className="space-y-4">
                <ListItem><p>You are responsible for keeping your login details secure.</p></ListItem>
                <ListItem><p>You agree not to share your account with others or impersonate another person.</p></ListItem>
                <ListItem><p>We reserve the right to suspend or close accounts for misuse.</p></ListItem>
              </ul>
            </section>

            <section id="payments" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Payments & Refunds</h2>
              <ul className="space-y-4">
                <ListItem><p>Payments are processed through trusted third-party gateways (Flutterwave).</p></ListItem>
                <ListItem><p>All prices include applicable taxes and service charges unless stated otherwise.</p></ListItem>
                <ListItem><p>For marketplace transactions, escrow funds are only released once delivery/service is confirmed.</p></ListItem>
                <ListItem><p>If a user cancels an order or request after payment has been made, payment gateway or transaction processing charges are non-refundable. Only the remaining balance (if any) may be refunded according to our Refund Policy.</p></ListItem>
              </ul>
            </section>

            <section id="responsibilities" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Responsibilities of Users</h2>
              <p className="mb-4">By using ServiPal, you agree NOT to:</p>
              <ul className="space-y-4">
                <ListItem><p>Use the App for illegal, fraudulent, or harmful activities.</p></ListItem>
                <ListItem><p>Upload false listings, misleading descriptions, or counterfeit items.</p></ListItem>
                <ListItem><p>Harass, abuse, or defraud other users or service providers.</p></ListItem>
                <ListItem><p>Attempt to hack, disrupt, or reverse-engineer our systems.</p></ListItem>
              </ul>
            </section>

            <section id="delivery" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Delivery, Food & Laundry Services</h2>
              <ul className="space-y-4">
                <ListItem><p>Delivery times are estimates and may vary due to circumstances beyond our control.</p></ListItem>
                <ListItem><p>Food and laundry services are provided by independent vendors; ServiPal is not responsible for food allergies, delays, or damages.</p></ListItem>
                <ListItem><p>Customers are responsible for verifying orders upon receipt.</p></ListItem>
              </ul>
            </section>

            <section id="marketplace" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Marketplace Transactions</h2>
              <ul className="space-y-4">
                <ListItem><p>Buyers and sellers must comply with applicable laws (e.g., no prohibited or illegal goods).</p></ListItem>
                <ListItem><p>Escrow protection applies only to transactions conducted within ServiPal.</p></ListItem>
                <ListItem><p>Disputes between buyers and sellers will be handled via our in-app dispute resolution system before funds are released.</p></ListItem>
              </ul>
            </section>

            <section id="intellectual" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Intellectual Property</h2>
              <ul className="space-y-4">
                <ListItem><p>All content, trademarks, and software in ServiPal belong to us or our licensors.</p></ListItem>
                <ListItem><p>You may not copy, modify, or distribute ServiPal's intellectual property without permission.</p></ListItem>
                <ListItem><p>User-generated content (e.g., listings, reviews) remains yours, but you grant ServiPal a non-exclusive, royalty-free license to use it for service delivery.</p></ListItem>
              </ul>
            </section>

            <section id="disclaimers" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Disclaimers & Limitation of Liability</h2>
              <ul className="space-y-4 mb-4">
                <ListItem><p>ServiPal is provided "as is" and "as available."</p></ListItem>
                <ListItem><p>We do not guarantee uninterrupted service, error-free operation, or specific outcomes.</p></ListItem>
              </ul>
              <p className="mb-4">To the fullest extent permitted by law, ServiPal is not liable for damages arising from:</p>
              <ul className="space-y-4">
                <ListItem><p>Delays, loss, or damages in delivery.</p></ListItem>
                <ListItem><p>Food quality, preparation, or health-related issues.</p></ListItem>
                <ListItem><p>Marketplace disputes, fraudulent items, or non-delivery.</p></ListItem>
              </ul>
            </section>

            <section id="termination" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Termination</h2>
              <ul className="space-y-4">
                <ListItem><p>We may suspend or terminate your account for breaches of these Terms or misuse of the platform.</p></ListItem>
                <ListItem><p>You may close your account at any time by contacting us.</p></ListItem>
              </ul>
            </section>

            <section id="governing" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Governing Law & Dispute Resolution</h2>
              <ul className="space-y-4">
                <ListItem><p>These Terms are governed by the laws of Nigeria.</p></ListItem>
                <ListItem><p>Disputes shall be addressed via our in-app resolution system.</p></ListItem>
              </ul>
            </section>

            <section id="changes" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Changes to Terms</h2>
              <ul className="space-y-4">
                <ListItem><p>We may update these Terms at any time.</p></ListItem>
                <ListItem><p>Continued use of ServiPal after updates means you accept the revised Terms.</p></ListItem>
              </ul>
            </section>
          </main>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndConditions;
