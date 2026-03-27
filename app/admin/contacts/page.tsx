"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import React from "react";
import {
  Search,
  Mail,
  User,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Inbox,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/supabase/supabase";

interface Contact {
  id: string;
  full_name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  created_at: string;
}

interface ContactsResponse {
  data: Contact[];
  total: number;
}

const PAGE_SIZE = 20;

function categoryColor(category: string) {
  switch (category?.toUpperCase()) {
    case "Account Issues":
      return "bg-blue-500/15 text-blue-600";
    case "Payment & Refunds":
      return "bg-orange-500/15 text-orange-600";
    case "Food Delivery":
      return "bg-purple-500/15 text-purple-600";
    case "Package Delivery":
      return "bg-green-500/15 text-green-600";
    case "Laundry Services":
      return "bg-gray-500/15 text-gray-600";
    case "Marketplace":
      return "bg-gray-500/15 text-gray-600";
    case "Technical Issues":
      return "bg-gray-500/15 text-gray-600";
    case "Vendor Inquiries":
      return "bg-gray-500/15 text-gray-600";
    case "Other":
      return "bg-gray-500/15 text-gray-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

async function fetchContacts(
  page: number,
  category: string,
  search: string,
): Promise<ContactsResponse> {
  let query = supabase
    .from("contacts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (category) {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`,
    );
  }

  const { data, count, error } = await query;

  console.log(data);

  if (error) throw error;

  return { data: data ?? [], total: count ?? 0 };
}

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data, isLoading } = useQuery<ContactsResponse>({
    queryKey: ["contacts", page, categoryFilter, search],
    queryFn: () => fetchContacts(page, categoryFilter, search),
  });

  const contacts = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Contacts" />

        <div className="flex h-[calc(100vh-var(--header-height))] overflow-hidden">
          {/* Left: Contact List */}
          <div
            className={cn(
              "flex flex-col border-r transition-all",
              selectedContact ? "w-96 shrink-0" : "flex-1",
            )}
          >
            {/* Filters */}
            <div className="p-3 space-y-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or subject..."
                  className="pl-9 h-8 text-sm"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Select
                value={categoryFilter || "ALL"}
                onValueChange={(v) => {
                  setCategoryFilter(v === "ALL" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="DELIVERY">Delivery</SelectItem>
                  <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                  <SelectItem value="LAUNDRY">Laundry</SelectItem>
                  <SelectItem value="MARKETPLACE">Marketplace</SelectItem>
                  <SelectItem value="OTHERS">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-2 p-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
                  <Inbox className="w-8 h-8 opacity-30" />
                  No contacts found
                </div>
              ) : (
                contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b transition-colors hover:bg-muted/50",
                      selectedContact?.id === contact.id &&
                        "bg-orange-500/10 border-l-2 border-l-orange-500",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm truncate">
                        {contact.full_name}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs shrink-0 ml-2",
                          categoryColor(contact.category),
                        )}
                      >
                        {contact.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/80 truncate">
                      {contact.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground truncate">
                        {contact.email}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto shrink-0">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="flex items-center justify-between px-3 py-2 border-t text-xs text-muted-foreground">
                <span>
                  {total} contact{total !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-1">
                  <span className="mr-1">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact Detail */}
          {selectedContact ? (
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              {/* Detail Header */}
              <div className="px-6 py-4 border-b flex items-center gap-3 shrink-0">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-lg truncate">
                    {selectedContact.subject}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    From {selectedContact.full_name}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs shrink-0",
                    categoryColor(selectedContact.category),
                  )}
                >
                  {selectedContact.category}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => setSelectedContact(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Detail Content */}
              <div className="flex-1 px-6 py-6 space-y-6">
                {/* Sender Info */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {selectedContact.full_name}
                    </span>
                  </div>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    {selectedContact.email}
                  </a>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedContact.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Message */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>

                {/* Quick Reply */}
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-muted-foreground gap-3">
              <Inbox className="w-10 h-10 opacity-30" />
              <p className="text-sm">Select a contact to view details</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
