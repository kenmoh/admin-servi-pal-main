"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import React from "react";
import {
  Search,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
  X,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/supabase/supabase";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

interface SubscribersResponse {
  data: Subscriber[];
  total: number;
}

const PAGE_SIZE = 20;

async function fetchSubscribers(
  page: number,
  search: string,
): Promise<SubscribersResponse> {
  let query = supabase
    .from("email_subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (search) {
    query = query.ilike("email", `%${search}%`);
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return { data: (data as Subscriber[]) ?? [], total: count ?? 0 };
}

export default function SubscribersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  const { data, isLoading, refetch } = useQuery<SubscribersResponse>({
    queryKey: ["subscribers", page, search],
    queryFn: () => fetchSubscribers(page, search),
  });

  const subscribers = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    const { error } = await supabase
      .from("email_subscribers")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting subscriber: " + error.message);
    } else {
      setSelectedSubscriber(null);
      refetch();
    }
  };

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
        <SiteHeader title="Subscribers" />

        <div className="flex h-[calc(100vh-var(--header-height))] overflow-hidden">
          {/* Left: Subscriber List */}
          <div
            className={cn(
              "flex flex-col border-r transition-all",
              selectedSubscriber ? "w-96 shrink-0" : "flex-1",
            )}
          >
            {/* Filters */}
            <div className="p-3 space-y-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
                  className="pl-9 h-8 text-sm"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-2 p-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : subscribers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
                  <Inbox className="w-8 h-8 opacity-30" />
                  No subscribers found
                </div>
              ) : (
                subscribers.map((subscriber) => (
                  <button
                    key={subscriber.id}
                    onClick={() => setSelectedSubscriber(subscriber)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b transition-colors hover:bg-muted/50",
                      selectedSubscriber?.id === subscriber.id &&
                        "bg-orange-500/10 border-l-2 border-l-orange-500",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {subscriber.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="flex items-center justify-between px-3 py-2 border-t text-xs text-muted-foreground">
                <span>
                  {total} subscriber{total !== 1 ? "s" : ""}
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

          {/* Right: Subscriber Detail */}
          {selectedSubscriber ? (
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              {/* Detail Header */}
              <div className="px-6 py-4 border-b flex items-center gap-3 shrink-0">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-lg truncate">
                    Subscriber Details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Managing subscriber preferences
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => setSelectedSubscriber(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Detail Content */}
              <div className="flex-1 px-6 py-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border">
                    <Mail className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium">Email Address</p>
                      <p className="text-lg">{selectedSubscriber.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Subscription Date</p>
                      <p className="text-lg">
                        {new Date(selectedSubscriber.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button
                    variant="destructive"
                    className="gap-2"
                    onClick={() => handleDelete(selectedSubscriber.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Subscriber
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-muted-foreground gap-3">
              <Mail className="w-10 h-10 opacity-30" />
              <p className="text-sm">Select a subscriber to view details</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
