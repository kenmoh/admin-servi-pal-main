"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Search } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const faqCategories = [
    {
      category: "General Questions",
      questions: [
        {
          id: "gen-1",
          question: "What is ServiPal?",
          answer:
            "ServiPal is Nigeria's trusted multi-vendor lifestyle app that connects customers with verified service providers. We offer food delivery, package logistics, laundry services, and a peer-to-peer marketplace—all in one convenient platform.",
        },
        {
          id: "gen-2",
          question: "How do I create an account?",
          answer:
            "Download the ServiPal app from Google Play Store or Apple App Store. Open the app, tap 'Sign Up', and follow the prompts to create your account using your phone number or email address. Verify your account and you're ready to go!",
        },
        {
          id: "gen-3",
          question: "Is ServiPal available in my city?",
          answer:
            "ServiPal is currently available across major Nigerian cities and continuously expanding. Check the app to see if services are available in your specific location. If we're not in your area yet, stay tuned—we're growing fast!",
        },
        {
          id: "gen-4",
          question: "How do I become a vendor on ServiPal?",
          answer:
            "Register as a vendor through the ServiPal app by selecting 'Vendor Sign Up'. Complete the verification process by providing your business details and required documents. Once approved, you can start listing your services and reaching thousands of customers!",
        },
      ],
    },
    {
      category: "Payments & Pricing",
      questions: [
        {
          id: "pay-1",
          question: "What payment methods do you accept?",
          answer:
            "We accept bank transfers, debit cards, and credit cards through our secure payment gateway powered by Flutterwave. All transactions are encrypted and protected for your safety.",
        },
        {
          id: "pay-2",
          question: "How does the escrow system work?",
          answer:
            "For marketplace transactions, your payment is held securely by ServiPal until you confirm that you've received your item and are satisfied with it. This protects both buyers and sellers, ensuring fair transactions for everyone.",
        },
        {
          id: "pay-3",
          question: "Can I get a refund if I'm not satisfied?",
          answer:
            "Yes! If there's an issue with your order, you can request a refund through our in-app dispute resolution system. Please note that payment gateway processing fees are non-refundable. Refund eligibility depends on the specific service and circumstances.",
        },
        {
          id: "pay-4",
          question: "Are there any hidden charges?",
          answer:
            "No hidden charges! All prices displayed include applicable taxes and service charges. You'll always see the total cost before confirming your order. Transparency is important to us.",
        },
      ],
    },
    {
      category: "Food Delivery",
      questions: [
        {
          id: "food-1",
          question: "How long does food delivery take?",
          answer:
            "Delivery times vary depending on restaurant preparation time and your location, but typically range from 30-60 minutes. You can track your order in real-time through the app to see exactly when it will arrive.",
        },
        {
          id: "food-2",
          question: "What if my food arrives cold or incorrect?",
          answer:
            "We're sorry if this happens! Contact our support team immediately through the app. We'll work with the restaurant to resolve the issue, which may include a refund, replacement, or credit for your next order.",
        },
        {
          id: "food-3",
          question: "Can I customize my food order?",
          answer:
            "Yes! Most restaurants allow customizations. When placing your order, look for the 'Special Instructions' field where you can add your preferences, dietary restrictions, or modification requests.",
        },
        {
          id: "food-4",
          question: "Do you have minimum order requirements?",
          answer:
            "Minimum order requirements vary by restaurant. Some restaurants set minimum order values to make delivery viable. You'll see any minimum order amount on the restaurant's page before you order.",
        },
      ],
    },
    {
      category: "Package Delivery",
      questions: [
        {
          id: "pkg-1",
          question: "What items can I send through ServiPal?",
          answer:
            "You can send most items including documents, gifts, electronics, clothing, and food items. However, we don't accept illegal items, hazardous materials, or prohibited goods. Check our Terms & Conditions for the complete list.",
        },
        {
          id: "pkg-2",
          question: "How do I track my package?",
          answer:
            "Once your delivery is confirmed, you'll receive a tracking link in the app. You can monitor your package's real-time location and get updates at every stage—from pickup to delivery.",
        },
        {
          id: "pkg-3",
          question: "What if my package gets lost or damaged?",
          answer:
            "While this is rare, we take such incidents seriously. Contact our support team immediately with your tracking number. We'll investigate and work toward a resolution, which may include compensation based on our liability policy.",
        },
        {
          id: "pkg-4",
          question: "Can I schedule a delivery for a specific time?",
          answer:
            "Yes! When placing your delivery order, you can select a preferred pickup and delivery time window. Our dispatch riders will do their best to meet your schedule, though exact timing may vary slightly based on traffic and other factors.",
        },
      ],
    },
    {
      category: "Laundry Services",
      questions: [
        {
          id: "lau-1",
          question: "How does the laundry service work?",
          answer:
            "Book a pickup through the app, and our partner laundry service will collect your items at your chosen time. They'll clean, iron, and return your clothes within the agreed timeframe—usually 24-48 hours depending on the service level you choose.",
        },
        {
          id: "lau-2",
          question: "What types of clothing do you handle?",
          answer:
            "Our laundry partners handle everyday clothing, bed linens, towels, and most fabric items. For special items like wedding dresses, leather, or delicate fabrics, please contact the laundry provider through the app to confirm they can handle them.",
        },
        {
          id: "lau-3",
          question: "What if my clothes are damaged during cleaning?",
          answer:
            "Our laundry partners are professionals who take great care with your items. However, if damage occurs, report it immediately through the app with photos. We'll work with the provider to investigate and arrange appropriate compensation.",
        },
        {
          id: "lau-4",
          question: "Can I request specific detergents or cleaning methods?",
          answer:
            "Yes! When booking your laundry service, you can add special instructions about preferred detergents, fabric softeners, or specific cleaning requirements. Just include these details in the 'Special Instructions' section.",
        },
      ],
    },
    {
      category: "P2P Marketplace",
      questions: [
        {
          id: "p2p-1",
          question: "How do I buy items on the marketplace?",
          answer:
            "Browse listings in the marketplace section, select an item you're interested in, and contact the seller through our in-app messaging. Once you agree on terms, complete the purchase—your payment will be held in escrow until you confirm receipt of the item.",
        },
        {
          id: "p2p-2",
          question: "How do I sell items on ServiPal?",
          answer:
            "Create a listing by going to the marketplace section and tapping 'Sell an Item'. Add photos, description, price, and other details. Once your listing is live, interested buyers can contact you directly through the app.",
        },
        {
          id: "p2p-3",
          question: "Is it safe to buy from strangers?",
          answer:
            "Yes! Our escrow system protects you. Your payment is held securely until you confirm you've received the item and are satisfied. Plus, our rating system helps you identify trustworthy sellers. Always check ratings and reviews before purchasing.",
        },
        {
          id: "p2p-4",
          question: "What happens if I receive a fake or damaged item?",
          answer:
            "Don't release the escrow payment! Immediately report the issue through our dispute resolution system with photos and details. Our team will investigate and mediate between you and the seller to reach a fair resolution.",
        },
      ],
    },
    {
      category: "Account & Security",
      questions: [
        {
          id: "sec-1",
          question: "How do I reset my password?",
          answer:
            "On the login screen, tap 'Forgot Password'. Enter your registered email or phone number, and we'll send you a verification code to reset your password. Follow the prompts to create a new password.",
        },
        {
          id: "sec-2",
          question: "Is my personal information safe?",
          answer:
            "Absolutely! We use industry-standard encryption to protect your data. We never share your personal information with third parties without your consent. Read our Privacy Policy for complete details on how we handle your information.",
        },
        {
          id: "sec-3",
          question: "How do I update my profile information?",
          answer:
            "Go to 'Settings' in the app menu, then select 'Profile'. You can update your name, phone number, email, delivery addresses, and other information. Don't forget to save your changes!",
        },
        {
          id: "sec-4",
          question: "Can I delete my account?",
          answer:
            "Yes, you can delete your account at any time. Go to Settings > Account > Delete Account. Please note this action is permanent and will remove all your data from our system. Make sure to resolve any pending orders first.",
        },
      ],
    },
  ];

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const FAQItem = ({
    id,
    question,
    answer,
  }: {
    id: string;
    question: string;
    answer: string;
  }) => {
    const isOpen = openItems.includes(id);

    return (
      <div className="border border-border/30 rounded-lg overflow-hidden bg-card hover:border-primary/30 transition-all">
        <button
          onClick={() => toggleItem(id)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/5 transition-colors"
        >
          <span className="font-medium pr-4">{question}</span>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="px-6 py-4 bg-accent/5 border-t border-border/30">
            <p className="text-muted-foreground leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="">
      <Card className="text-card-foreground px-2 shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center">
            Frequently Asked Questions
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Find answers to common questions about ServiPal
          </p>
        </CardHeader>

        <CardContent className="max-w-4xl mx-auto space-y-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-base"
            />
          </div>

          {/* FAQ Categories */}
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2 flex items-center">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mr-3">
                    {category.questions.length}
                  </span>
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((q) => (
                    <FAQItem key={q.id} {...q} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No questions match your search. Try different keywords or browse
                all categories above.
              </p>
            </div>
          )}

          {/* Still Need Help Section */}
          <section className="mt-12 p-8 bg-primary/5 rounded-lg border-2 border-primary/20 text-center space-y-4">
            <h3 className="text-2xl font-bold">Still Need Help?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is
              ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <a
                href="/support"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@servi-pal.com"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-md hover:bg-primary/10 transition-colors font-medium"
              >
                Email Us
              </a>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQPage;
