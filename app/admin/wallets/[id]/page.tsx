"use client";

import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowUpRight, Clock, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { WalletWithTransactions } from "@/types/user-types";
import React from "react";

function statusColor(status: string) {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
    case "COMPLETED":
      return "bg-green-500/15 text-green-600";
    case "PENDING":
      return "bg-yellow-500/15 text-yellow-600";
    case "FAILED":
      return "bg-red-500/15 text-red-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

export default function WalletDetailPage() {
  const params = useParams();
  const router = useRouter();
  const walletId = params.id as string;

  const { data: wallet, isLoading } = useQuery<WalletWithTransactions>({
    queryKey: ["wallet", walletId],
    queryFn: async () => {
      const response = await fetch(`/api/wallets/${walletId}`);
      if (!response.ok) throw new Error("Failed to fetch wallet");
      return response.json();
    },
  });

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
        <SiteHeader title="Wallet Detail" />

        <div className="space-y-6 px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading wallet...
            </div>
          ) : !wallet ? (
            <div className="text-center py-8 text-muted-foreground">
              Wallet not found.
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                        Available Balance
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        ₦{wallet.balance.toLocaleString()}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                        Escrow (Reserved)
                      </p>
                      <p className="text-2xl font-bold text-amber-600 mt-2">
                        ₦{wallet.escrow_balance.toLocaleString()}
                      </p>
                    </div>
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Total Balance
                      </p>
                      <p className="text-2xl font-bold mt-2">
                        ₦
                        {(
                          Number(wallet.balance) + Number(wallet.escrow_balance)
                        ).toLocaleString()}
                      </p>
                    </div>
                    <Wallet className="w-5 h-5" />
                  </div>
                </Card>
              </div>

              {/* Wallet Info */}
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> Wallet Information
                </h3>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      Wallet ID
                    </p>
                    <p className="font-mono font-semibold mt-1">{wallet.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      User ID
                    </p>
                    <p className="font-mono font-semibold mt-1">
                      {wallet.user_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      Created
                    </p>
                    <p className="font-semibold mt-1">
                      {new Date(wallet.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      Last Updated
                    </p>
                    <p className="font-semibold mt-1">
                      {wallet.updated_at
                        ? new Date(wallet.updated_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Transactions */}
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold">
                  Transaction History ({wallet.transactions.length})
                </h3>
                <Separator />
                {wallet.transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No transactions found
                  </p>
                ) : (
                  <div className="space-y-2">
                    {wallet.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between py-2 border-b last:border-0 text-sm"
                      >
                        <div>
                          <p className="font-medium">{tx.transaction_type}</p>
                          {/* <p className="text-xs text-muted-foreground">{tx.description || tx.tx_ref || "—"}</p> */}
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold">
                            ₦{tx.amount.toLocaleString()}
                          </p>
                          <Badge
                            variant="secondary"
                            className={statusColor(tx.payment_status || "")}
                          >
                            {tx.payment_status || "N/A"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
