"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BackButton } from "@/components/back-button";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "how-to-delete", title: "How to Delete Your Account" },
  { id: "what-happens", title: "What Happens to Your Data" },
  { id: "retained-data", title: "Data We May Retain" },
  { id: "contact", title: "Contact Us" },
];

const DeleteAccount = () => {
  const [activeSection, setActiveSection] = useState("overview");
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
    handleScroll();
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
                setIsSheetOpen(false);
                setTimeout(() => {
                  const element = document.getElementById(section.id);
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 100,
                      behavior: "smooth",
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

  const ListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start">
      <CheckCircle className="text-primary w-5 h-5 mr-3 mt-1 shrink-0" />
      <div>{children}</div>
    </li>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <Card className="bg-card text-card-foreground mt-4">
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
            <CardTitle className="text-3xl font-bold text-center grow">
              Delete Account
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-12">
          <aside className="hidden md:block md:col-span-3">
            <SidebarContent />
          </aside>
          <main className="col-span-12 md:col-span-9">
            <p className="text-muted-foreground mb-6">
              Last updated: March 21, 2026
            </p>
            <p className="mb-6">
              We respect your right to control your personal data. This page
              explains how to permanently delete your ServiPal account and what
              happens to your data after deletion.
            </p>

            <section id="overview" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                Overview
              </h2>
              <p className="mb-4">
                Deleting your ServiPal account is a permanent action. Once your
                account is deleted, you will lose access to all your account
                data, order history, wallet balance, and any active listings or
                ongoing transactions on the platform.
              </p>
              <p className="mb-4">
                We strongly recommend that you resolve any pending orders,
                withdraw any available wallet balance, and download any data you
                wish to keep before initiating account deletion.
              </p>
            </section>

            <section id="how-to-delete" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                How to Delete Your Account
              </h2>
              <p className="mb-4">
                You can request deletion of your ServiPal account using either
                of the following methods:
              </p>
              <h3 className="text-xl font-semibold mb-3">
                Option 1 &mdash; Delete from the App
              </h3>
              <ol className="space-y-3 mb-6">
                {[
                  'Open the ServiPal app and log in to your account.',
                  'Tap your profile icon or navigate to Settings.',
                  'Select "Account" and then "Delete Account".',
                  'Read the confirmation notice, then tap "Confirm Delete".',
                  'Your account will be scheduled for permanent deletion.',
                ].map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1 shrink-0">
                      {index + 1}
                    </span>
                    <div>{step}</div>
                  </li>
                ))}
              </ol>
              <h3 className="text-xl font-semibold mb-3">
                Option 2 &mdash; Submit a Request by Email
              </h3>
              <p className="mb-4">
                If you are unable to access the app, you may submit an account
                deletion request by emailing us at{" "}
                <a
                  href="mailto:servipal@servi-pal.com"
                  className="text-primary hover:underline"
                >
                  servipal@servi-pal.com
                </a>{" "}
                with the subject line{" "}
                <strong>&ldquo;Account Deletion Request&rdquo;</strong>. Please
                include the email address or phone number associated with your
                account. We will process your request within{" "}
                <strong>30 days</strong>.
              </p>
            </section>

            <section id="what-happens" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                What Happens to Your Data
              </h2>
              <p className="mb-4">
                Upon account deletion, the following data will be permanently
                removed from our systems:
              </p>
              <ul className="space-y-4">
                <ListItem>
                  <p>Your profile information (name, email, phone number, address)</p>
                </ListItem>
                <ListItem>
                  <p>Profile photo and any uploaded media</p>
                </ListItem>
                <ListItem>
                  <p>Marketplace listings and saved items</p>
                </ListItem>
                <ListItem>
                  <p>Order and delivery history</p>
                </ListItem>
                <ListItem>
                  <p>In-app messages and chat history</p>
                </ListItem>
                <ListItem>
                  <p>Saved payment methods and wallet information</p>
                </ListItem>
              </ul>
            </section>

            <section id="retained-data" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                Data We May Retain
              </h2>
              <p className="mb-4">
                In certain circumstances, we may be required to retain some data
                even after your account is deleted. This is limited to:
              </p>
              <ul className="space-y-4">
                <ListItem>
                  <p>
                    <strong>Legal and regulatory compliance</strong> &mdash;
                    transaction records may be retained for up to{" "}
                    <strong>7 years</strong> as required by Nigerian financial
                    and tax regulations.
                  </p>
                </ListItem>
                <ListItem>
                  <p>
                    <strong>Fraud prevention</strong> &mdash; anonymised or
                    aggregated data used to detect and prevent fraudulent
                    activity.
                  </p>
                </ListItem>
                <ListItem>
                  <p>
                    <strong>Dispute resolution</strong> &mdash; records related
                    to any unresolved disputes or chargebacks at the time of
                    deletion.
                  </p>
                </ListItem>
              </ul>
              <p className="mt-4">
                Any retained data will be securely stored, strictly limited to
                the purposes described above, and deleted as soon as those
                purposes are fulfilled.
              </p>
            </section>

            <section id="contact" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                Contact Us
              </h2>
              <p className="mb-4">
                If you have questions about account deletion or your personal
                data, please reach out:
              </p>
              <ul className="space-y-4">
                <ListItem>
                  <p>
                    By email:{" "}
                    <a
                      href="mailto:servipal@servi-pal.com"
                      className="text-primary hover:underline"
                    >
                      servipal@servi-pal.com
                    </a>
                  </p>
                </ListItem>
                <ListItem>
                  <p>
                    By visiting our website:{" "}
                    <a
                      href="https://www.servi-pal.com/"
                      rel="external nofollow noopener"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      https://www.servi-pal.com
                    </a>
                  </p>
                </ListItem>
              </ul>
            </section>
          </main>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteAccount;
