"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Transaction,
  TransactionListResponse,
} from "@/types/transaction-types";
import { DataTable } from "@/components/tables/data-table";
import { transactionsColumns } from "@/components/tables/transactions-columns";
import { TransactionVerifyDialog } from "@/components/modals/transaction-verify-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PAYMENT_STATUSES = ["PENDING", "SUCCESS", "FAILED", "COMPLETED"];

function formatDate(date: Date | undefined): string {
  return date ? format(date, "yyyy-MM-dd") : "";
}

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const { data, isLoading } = useQuery<TransactionListResponse>({
    queryKey: ["transactions", page, paymentStatus, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), page_size: "10" });
      if (paymentStatus) params.set("payment_status", paymentStatus);
      if (dateFrom) params.set("start_date", formatDate(dateFrom));
      if (dateTo) params.set("end_date", formatDate(dateTo));
      const res = await fetch(`/api/transactions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });

  const transactions = data?.data ?? [];
  const pageInfo = data?.meta;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Transactions" />

        <div className="space-y-6 px-6 py-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-muted-foreground">
              List all transactions and verify them against the payment
              provider.
            </p>
            <div className="flex items-center gap-2">
              <Select
                value={paymentStatus || "ALL"}
                onValueChange={(v) => {
                  setPaymentStatus(v === "ALL" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-sm w-40">
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  {PAYMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-8 text-sm w-36 justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={(day) => {
                      setDateFrom(day);
                      setPage(1);
                    }}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-8 text-sm w-36 justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {dateTo ? format(dateTo, "MMM d, yyyy") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={(day) => {
                      setDateTo(day);
                      setPage(1);
                    }}
                  />
                </PopoverContent>
              </Popover>

              {(paymentStatus || dateFrom || dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setPaymentStatus("");
                    setDateFrom(undefined);
                    setDateTo(undefined);
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
              Loading transactions...
            </div>
          ) : (
            <>
              <DataTable
                columns={transactionsColumns((transaction) =>
                  setSelected(transaction),
                )}
                data={transactions}
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

        <TransactionVerifyDialog
          transaction={selected}
          onClose={() => setSelected(null)}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}