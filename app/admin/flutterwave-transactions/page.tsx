"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  FlutterwaveTransactionListItem,
  FlutterwaveTransactionListResponse,
} from "@/types/transaction-types";
import { DataTable } from "@/components/tables/data-table";
import { flutterwaveTransactionsColumns } from "@/components/tables/flutterwave-transactions-columns";
import { FlutterwaveTransactionDrawer } from "@/components/drawers/flutterwave-transaction-drawer";
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

const STATUSES = ["SUCCESS", "FAILED", "PENDING"];

function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function yesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function FlutterwaveTransactionsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>(yesterday());
  const [dateTo, setDateTo] = useState<Date>(yesterday());
  const [appliedFrom, setAppliedFrom] = useState<Date>(yesterday());
  const [appliedTo, setAppliedTo] = useState<Date>(yesterday());
  const [selected, setSelected] = useState<FlutterwaveTransactionListItem | null>(null);

  const { data, isLoading } = useQuery<FlutterwaveTransactionListResponse>({
    queryKey: ["flutterwave-transactions", page, status, appliedFrom, appliedTo],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), per_page: "10" });
      if (status) params.set("status", status);
      params.set("from", formatDate(appliedFrom));
      params.set("to", formatDate(appliedTo));
      const res = await fetch(`/api/flutterwave-transactions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch flutterwave transactions");
      return res.json();
    },
  });

  const transactions = Array.isArray(data?.data) ? data.data : [];
  const pageInfo = data?.meta?.page_info;

  function applyFilter() {
    setAppliedFrom(dateFrom);
    setAppliedTo(dateTo);
    setPage(1);
  }

  function clearAll() {
    setStatus("");
    setDateFrom(yesterday());
    setDateTo(yesterday());
    setAppliedFrom(yesterday());
    setAppliedTo(yesterday());
    setPage(1);
  }

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

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 text-sm w-36 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {format(dateFrom, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={(day) => day && setDateFrom(day)}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 text-sm w-36 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {format(dateTo, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={(day) => day && setDateTo(day)}
                  />
                </PopoverContent>
              </Popover>

              <Button
                size="sm"
                className="h-8"
                onClick={applyFilter}
              >
                <Search className="w-3.5 h-3.5 mr-1" /> Filter
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={clearAll}
              >
                <X className="w-3.5 h-3.5 mr-1" /> Clear
              </Button>
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
