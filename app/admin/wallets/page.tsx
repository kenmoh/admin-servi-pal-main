"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Search, Wallet, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { WalletListResponse, WalletWithTransactions } from "@/types/user-types";
import { useRouter } from "next/navigation";

export default function WalletsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { data, isLoading } = useQuery<WalletListResponse>({
    queryKey: ["wallets", page],
    queryFn: async () => {
      const response = await fetch(`/api/wallets?page=${page}&limit=20`);
      if (!response.ok) throw new Error("Failed to fetch wallets");
      return response.json();
    },
  });

  const wallets = (data?.data ?? []).filter(
    (w) =>
      !searchTerm ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.user_id.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const meta = data?.meta;

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
        <SiteHeader title="Wallet Management" />

        <div className="space-y-6 px-6 py-4">
          <p className="text-muted-foreground">
            Monitor user and vendor wallets with transaction history.
          </p>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by wallet ID or user ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading wallets...
            </div>
          ) : wallets.length === 0 ? (
            <Card className="p-12 text-center">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
              <p className="text-muted-foreground">No wallets found</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {wallets.map((wallet) => (
                  <Card
                    key={wallet.id}
                    onClick={() =>
                      router.push(`/admin/wallets/${wallet.user_id}`)
                    }
                    className="p-4 cursor-pointer hover:border-primary/50 transition-all"
                  >
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          User ID
                        </p>
                        <p className="font-mono text-sm truncate mt-0.5">
                          {wallet.user_id}
                        </p>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Balance</span>
                          <span className="font-bold text-green-600">
                            ₦{wallet.balance.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Escrow</span>
                          <span className="font-semibold text-amber-600">
                            ₦{wallet.escrow_balance.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-semibold">Total</span>
                          <span className="font-bold">
                            ₦
                            {(
                              Number(wallet.balance) +
                              Number(wallet.escrow_balance)
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(wallet.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {meta && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {meta.page} of {meta.total_pages} &mdash; {meta.total}{" "}
                    total
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === meta.total_pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
