"use client";

import React, { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Search, X, TrendingUp, ReceiptText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  CommissionListResponse,
  CommissionSummary,
  CommissionTotalsResponse,
  ServiceType,
} from "@/types/commission-types";
import { DataTable } from "@/components/tables/data-table";
import { commissionColumns } from "@/components/tables/commission-columns";
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
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const SERVICE_TYPES: ServiceType[] = ["DELIVERY", "FOOD", "LAUNDRY", "PRODUCT"];
const PERIODS = ["daily", "weekly", "monthly"] as const;

function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function formatAmount(amount: string | number | undefined) {
  const value = Number(amount ?? 0);
  if (Number.isNaN(value)) return "—";
  return `₦${value.toLocaleString()}`;
}

export default function PlatformCommissionPage() {
  const [page, setPage] = useState(1);
  const [serviceType, setServiceType] = useState("");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [appliedService, setAppliedService] = useState("");
  const [appliedFrom, setAppliedFrom] = useState<Date | undefined>(undefined);
  const [appliedTo, setAppliedTo] = useState<Date | undefined>(undefined);
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  // Summary cards (total commission + count)
  const { data: summary, isLoading: summaryLoading } = useQuery<CommissionSummary>({
    queryKey: ["commission-summary", appliedService, appliedFrom, appliedTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (appliedService) params.set("service_type", appliedService);
      if (appliedFrom) params.set("start_date", formatDate(appliedFrom));
      if (appliedTo) params.set("end_date", formatDate(appliedTo));
      const qs = params.toString();
      const res = await fetch(`/api/analytics?endpoint=summary${qs ? `&${qs}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch commission summary");
      return res.json();
    },
  });

  // Period-based totals
  const { data: totals, isLoading: totalsLoading } = useQuery<CommissionTotalsResponse>({
    queryKey: ["commission-totals", period, appliedService, appliedFrom, appliedTo],
    queryFn: async () => {
      const params = new URLSearchParams({ period });
      if (appliedService) params.set("service_type", appliedService);
      if (appliedFrom) params.set("start_date", formatDate(appliedFrom));
      if (appliedTo) params.set("end_date", formatDate(appliedTo));
      const qs = params.toString();
      const res = await fetch(`/api/analytics?endpoint=totals${qs ? `&${qs}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch commission totals");
      return res.json();
    },
  });

  // Paginated commission list
  const { data: list, isLoading: listLoading } = useQuery<CommissionListResponse>({
    queryKey: ["commission-list", page, appliedService, appliedFrom, appliedTo],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), page_size: "20" });
      if (appliedService) params.set("service_type", appliedService);
      if (appliedFrom) params.set("start_date", formatDate(appliedFrom));
      if (appliedTo) params.set("end_date", formatDate(appliedTo));
      const qs = params.toString();
      const res = await fetch(`/api/analytics?endpoint=${qs ? `&${qs}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch commissions");
      return res.json();
    },
  });

  const commissions = list?.data ?? [];
  const pageInfo = list?.meta;

  function applyFilter() {
    setAppliedService(serviceType);
    setAppliedFrom(dateFrom);
    setAppliedTo(dateTo);
    setPage(1);
  }

  function clearAll() {
    setServiceType("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setAppliedService("");
    setAppliedFrom(undefined);
    setAppliedTo(undefined);
    setPeriod("daily");
    setPage(1);
  }

  return (
    <>
      <SiteHeader title="Platform Commission" />

      <div className="space-y-6 px-6 py-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-muted-foreground">
            Monitor platform commissions earned across all service types.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={serviceType || "ALL"}
              onValueChange={(v) => setServiceType(v === "ALL" ? "" : v)}
            >
              <SelectTrigger className="h-8 text-sm w-40">
                <SelectValue placeholder="Service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All services</SelectItem>
                {SERVICE_TYPES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 text-sm w-36 justify-start text-left font-normal"
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
                    setDateFromOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 text-sm w-36 justify-start text-left font-normal"
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
                    setDateToOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            <Button size="sm" className="h-8" onClick={applyFilter}>
              <Search className="w-3.5 h-3.5 mr-1" /> Filter
            </Button>

            <Button variant="ghost" size="sm" className="h-8" onClick={clearAll}>
              <X className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {summaryLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Commission
                  </CardTitle>
                  <div className="p-2 rounded-md bg-orange-500/10 text-orange-500">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {formatAmount(summary?.total_commission)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Transaction Count
                  </CardTitle>
                  <div className="p-2 rounded-md bg-green-500/10 text-green-500">
                    <ReceiptText className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {summary?.transaction_count?.toLocaleString() ?? "—"}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Period Totals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Commission Totals ({period})
            </CardTitle>
            <Select
              value={period}
              onValueChange={(v) => setPeriod(v as "daily" | "weekly" | "monthly")}
            >
              <SelectTrigger className="h-8 text-sm w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p[0].toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {totalsLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : totals && totals.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="py-2 px-3">Period Start</th>
                      <th className="py-2 px-3">Total Commission</th>
                      <th className="py-2 px-3">Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totals.data.map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 px-3 text-sm">
                          {new Date(row.period_start).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-sm font-medium">
                          {formatAmount(row.total_commission)}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          <Badge variant="outline">{row.transaction_count}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                No commission totals found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Commission List */}
        {listLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading commissions...
          </div>
        ) : (
          <>
            <DataTable columns={commissionColumns} data={commissions} />

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
    </>
  );
}