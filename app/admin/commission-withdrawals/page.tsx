"use client";

import React, { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, X, TrendingUp, ArrowDownCircle, Wallet } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CommissionWithdrawalBalance,
  CommissionWithdrawalListResponse,
  CommissionLedgerWeek,
  CommissionWithdrawalCreate,
} from "@/types/commission-types";
import { DataTable } from "@/components/tables/data-table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function fmt(n: any) {
  const num = Number(n);
  if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `₦${(num / 1_000).toFixed(1)}K`;
  return `₦${Number.isNaN(num) ? 0 : num.toFixed(0)}`;
}

function formatAmount(amount: string | number | undefined) {
  const value = Number(amount ?? 0);
  if (Number.isNaN(value)) return "—";
  return `₦${value.toLocaleString()}`;
}

function statusColor(status: string) {
  switch (status) {
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

function shortId(id?: string | null) {
  if (!id) return "—";
  return `${id.slice(0, 8)}…`;
}

const withdrawalColumns = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <Badge variant="secondary" className={statusColor(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }: any) => (
      <span className="font-medium">{formatAmount(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: "period",
    header: "Period",
    cell: ({ row }: any) => {
      const r = row.original;
      if (r.period_start && r.period_end) {
        return <span className="text-sm">{format(new Date(r.period_start), "MMM d")} – {format(new Date(r.period_end), "MMM d, yyyy")}</span>;
      }
      return <span className="text-sm text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }: any) => (
      <span className="font-mono text-xs">{shortId(row.original.reference)}</span>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }: any) => (
      <span className="text-sm truncate max-w-[200px]">{row.original.notes || "—"}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Recorded At",
    cell: ({ row }: any) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.created_at).toLocaleString()}
      </span>
    ),
  },
];

const ledgerColumns = [
  {
    accessorKey: "week_start",
    header: "Week Starting",
    cell: ({ row }: any) => (
      <span className="text-sm">{format(new Date(row.original.week_start), "MMM d, yyyy")}</span>
    ),
  },
  {
    accessorKey: "accrued",
    header: "Accrued",
    cell: ({ row }: any) => (
      <span className="text-sm text-green-600">{formatAmount(row.original.accrued)}</span>
    ),
  },
  {
    accessorKey: "withdrawn",
    header: "Withdrawn",
    cell: ({ row }: any) => (
      <span className="text-sm text-red-500">-{formatAmount(row.original.withdrawn)}</span>
    ),
  },
  {
    accessorKey: "running_balance",
    header: "Balance",
    cell: ({ row }: any) => (
      <span className="font-medium">{formatAmount(row.original.running_balance)}</span>
    ),
  },
];

export default function CommissionWithdrawalsPage() {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formAmount, setFormAmount] = useState("");
  const [formRef, setFormRef] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);
  const queryClient = useQueryClient();

  // Balance
  const { data: balance, isLoading: balanceLoading } = useQuery<CommissionWithdrawalBalance>({
    queryKey: ["cw-balance"],
    queryFn: async () => {
      const res = await fetch("/api/commissions/withdrawals/balance");
      if (!res.ok) throw new Error("Failed to fetch balance");
      return res.json();
    },
  });

  // Withdrawal history
  const { data: list, isLoading: listLoading } = useQuery<CommissionWithdrawalListResponse>({
    queryKey: ["cw-list", page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), page_size: "15" });
      const res = await fetch(`/api/commissions/withdrawals?${params}`);
      if (!res.ok) throw new Error("Failed to fetch withdrawals");
      return res.json();
    },
  });

  // Ledger
  const { data: ledger, isLoading: ledgerLoading } = useQuery<CommissionLedgerWeek[]>({
    queryKey: ["cw-ledger"],
    queryFn: async () => {
      const res = await fetch("/api/commissions/withdrawals/ledger?weeks=12");
      if (!res.ok) throw new Error("Failed to fetch ledger");
      return res.json();
    },
  });

  // Record withdrawal
  const recordMutation = useMutation({
    mutationFn: async (payload: CommissionWithdrawalCreate) => {
      const res = await fetch("/api/commissions/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error || err.detail || "Failed to record withdrawal");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Withdrawal recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["cw-balance"] });
      queryClient.invalidateQueries({ queryKey: ["cw-list"] });
      queryClient.invalidateQueries({ queryKey: ["cw-ledger"] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to record withdrawal");
    },
  });

  function resetForm() {
    setFormAmount("");
    setFormRef("");
    setFormNotes("");
    setDateFrom(undefined);
    setDateTo(undefined);
  }

  function openDialog() {
    resetForm();
    setFormAmount(String(balance?.available_balance ?? 0));
    // Set current week range
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    setDateFrom(monday);
    setDateTo(sunday);
    setDialogOpen(true);
  }

  function handleRecord() {
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    recordMutation.mutate({
      amount,
      period_start: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
      period_end: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      reference: formRef || undefined,
      notes: formNotes || undefined,
    });
  }

  const withdrawals = list?.data ?? [];
  const pageInfo = list?.meta;

  // This week's accrual
  const thisWeekAccrual = ledger?.find((w) => {
    const d = new Date(w.week_start);
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return d >= weekAgo;
  })?.accrued ?? 0;

  return (
    <>
      <SiteHeader title="Commission Withdrawals" />

      <div className="space-y-6 px-6 py-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-muted-foreground">
            Track weekly commission accumulation and record manual Flutterwave withdrawals.
          </p>
          <Button onClick={openDialog} disabled={Number(balance?.available_balance ?? 0) <= 0}>
            <ArrowDownCircle className="w-4 h-4 mr-1" />
            Record Withdrawal
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {balanceLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <>
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">
                    Available to Withdraw
                  </CardTitle>
                  <div className="p-2 rounded-md bg-orange-500/10 text-orange-500">
                    <Wallet className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-700">
                    {formatAmount(balance?.available_balance)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Withdrawn
                  </CardTitle>
                  <div className="p-2 rounded-md bg-green-500/10 text-green-500">
                    <ArrowDownCircle className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {formatAmount(balance?.total_withdrawn)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Commission Earned
                  </CardTitle>
                  <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {formatAmount(balance?.total_commission)}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Weekly Ledger */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Weekly Ledger (last 12 weeks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ledgerLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : ledger && ledger.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ledger}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="week_start"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => format(new Date(v), "MMM d")}
                  />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v)} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatAmount(value), name === "accrued" ? "Accrued" : "Withdrawn"]}
                    labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
                  />
                  <Bar dataKey="accrued" fill="#22c55e" name="Accrued" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="withdrawn" fill="#ef4444" name="Withdrawn" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                No weekly data yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <>
                <DataTable columns={withdrawalColumns} data={withdrawals} />
                {pageInfo && (
                  <div className="flex items-center justify-between mt-4">
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
          </CardContent>
        </Card>

        {/* Ledger Table */}
        {ledger && ledger.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Weekly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={ledgerColumns} data={ledger} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Record Withdrawal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Withdrawal</DialogTitle>
            <DialogDescription>
              Record a manual Flutterwave withdrawal. The amount must match the
              available balance exactly — all unwithdrawn commissions will be marked.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Period Start</Label>
                <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateFrom ? format(dateFrom, "MMM d, yyyy") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(day) => { setDateFrom(day); setDateFromOpen(false); }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Period End</Label>
                <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateTo ? format(dateTo, "MMM d, yyyy") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(day) => { setDateTo(day); setDateToOpen(false); }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label htmlFor="reference">Flutterwave Reference (optional)</Label>
              <Input
                id="reference"
                value={formRef}
                onChange={(e) => setFormRef(e.target.value)}
                placeholder="Transfer reference"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Optional notes about this withdrawal"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRecord}
              disabled={recordMutation.isPending}
            >
              {recordMutation.isPending ? "Recording..." : "Record Withdrawal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
