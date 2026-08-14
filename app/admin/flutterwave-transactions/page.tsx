"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  FlutterwaveTransactionListItem,
  FlutterwaveTransactionListResponse,
} from "@/types/transaction-types";
import { DataTable } from "@/components/tables/data-table";
import { flutterwaveTransactionsColumns } from "@/components/tables/flutterwave-transactions-columns";
import { FlutterwaveTransactionDrawer } from "@/components/drawers/flutterwave-transaction-drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["SUCCESS", "FAILED", "PENDING"];

export default function FlutterwaveTransactionsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<FlutterwaveTransactionListItem | null>(null);

  const { data, isLoading } = useQuery<FlutterwaveTransactionListResponse>({
    queryKey: ["flutterwave-transactions", page, status],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), per_page: "10" });
      if (status) params.set("status", status);
      const res = await fetch(`/api/flutterwave-transactions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch flutterwave transactions");
      return res.json();
    },
  });

  const transactions = data?.data ?? [];
  const pageInfo = data?.meta?.page_info;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Flutterwave Transactions" />

        <div className="space-y-6 px-6 py-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-muted-foreground">
              List Flutterwave payment transactions and inspect their event
              timelines.
            </p>
            <div className="flex items-center gap-2">
              <Select
                value={status || "ALL"}
                onValueChange={(v) => {
                  setStatus(v === "ALL" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-sm w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {status && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setStatus("");
                    setPage(1);
                  }}
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading flutterwave transactions...
            </div>
          ) : (
            <>
              <DataTable
                columns={flutterwaveTransactionsColumns}
                data={transactions}
                onRowClick={(transaction: FlutterwaveTransactionListItem) =>
                  setSelected(transaction)
                }
              />

              {pageInfo && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {pageInfo.current_page} of {pageInfo.total_pages}
                    &mdash; {pageInfo.total} total
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
                      disabled={page === pageInfo.total_pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <FlutterwaveTransactionDrawer
          transaction={selected}
          onClose={() => setSelected(null)}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
