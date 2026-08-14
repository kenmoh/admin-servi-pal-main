"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { X, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FlutterwaveTransactionEvent,
  FlutterwaveTransactionEventsResponse,
  FlutterwaveTransactionListItem,
} from "@/types/transaction-types";
import { useQuery } from "@tanstack/react-query";

function statusColor(status: string) {
  switch (status?.toUpperCase()) {
    case "SUCCESSFUL":
    case "SUCCESS":
      return "bg-green-500/15 text-green-600";
    case "PENDING":
      return "bg-yellow-500/15 text-yellow-600";
    case "FAILED":
      return "bg-red-500/15 text-red-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

function formatAmount(amount: string | null, currency: string) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
  }).format(value);
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-sm break-all text-right" : "font-medium text-right"}>
        {value}
      </span>
    </div>
  );
}

export function FlutterwaveTransactionDrawer({
  transaction,
  onClose,
}: {
  transaction: FlutterwaveTransactionListItem | null;
  onClose: () => void;
}) {
  const id = transaction?.id ?? null;

  const { data: result, isLoading, isError } = useQuery<FlutterwaveTransactionEventsResponse>({
    queryKey: ["flutterwave-transaction-events", id],
    queryFn: async () => {
      const response = await fetch(`/api/flutterwave-transactions/${id}/events`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch transaction events");
      }
      return response.json();
    },
    enabled: !!id,
    retry: false,
  });

  const events: FlutterwaveTransactionEvent[] = result?.data ?? [];

  return (
    <Drawer open={!!transaction} onOpenChange={(open) => !open && onClose()} direction="right">
      <DrawerContent className="max-w-md h-full right-0 left-auto top-0 bottom-0 rounded-none border-none">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Transaction Events</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          {transaction && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <History className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg break-all">{transaction.tx_ref}</p>
                  <Badge variant="secondary" className={statusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <DetailRow
                  label="Amount"
                  value={formatAmount(transaction.amount, transaction.currency)}
                />
                <DetailRow
                  label="Charged Amount"
                  value={formatAmount(transaction.charged_amount, transaction.currency)}
                />
                <DetailRow
                  label="App Fee"
                  value={
                    transaction.app_fee
                      ? formatAmount(transaction.app_fee, transaction.currency)
                      : "—"
                  }
                />
                <DetailRow
                  label="Merchant Fee"
                  value={
                    transaction.merchant_fee
                      ? formatAmount(transaction.merchant_fee, transaction.currency)
                      : "—"
                  }
                />
                <DetailRow
                  label="Amount Settled"
                  value={
                    transaction.amount_settled
                      ? formatAmount(transaction.amount_settled, transaction.currency)
                      : "—"
                  }
                />
                <DetailRow label="Payment Type" value={transaction.payment_type} />
                <DetailRow label="Auth Model" value={transaction.auth_model} />
                <DetailRow label="Flutterwave Ref" value={transaction.flw_ref} mono />
                <DetailRow label="Narration" value={transaction.narration} />
                <DetailRow label="Processor Response" value={transaction.processor_response} />
              </div>

              {(transaction.account || transaction.customer_name || transaction.customer_email) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                      Customer & Account
                    </p>
                    <div className="space-y-2 text-sm">
                      <DetailRow label="Customer" value={transaction.customer_name} />
                      <DetailRow label="Email" value={transaction.customer_email} />
                      <DetailRow label="NUBAN" value={transaction.account?.nuban} mono />
                      <DetailRow label="Bank" value={transaction.account?.bank} />
                      <DetailRow label="Account ID" value={transaction.account_id} mono />
                      <DetailRow label="IP Address" value={transaction.ip} mono />
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                  Date
                </p>
                <p className="text-sm">
                  {transaction.created_at
                    ? new Date(transaction.created_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <p className="font-medium text-sm">Timeline</p>

            {isLoading ? (
              <div className="space-y-3 py-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : isError ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Failed to load transaction events. Please try again.
              </div>
            ) : events.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No events found for this transaction.
              </div>
            ) : (
              <ol className="relative space-y-4 border-l border-border ml-2 pl-4">
                {events.map((event, index) => (
                  <li key={index} className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{event.action || "Event"}</p>
                      <span className="text-xs text-muted-foreground">
                        {event.created_at
                          ? new Date(event.created_at).toLocaleString()
                          : "—"}
                      </span>
                    </div>
                    {event.object && (
                      <p className="text-xs text-muted-foreground">{event.object}</p>
                    )}
                    {event.actor && <p className="text-xs text-muted-foreground">By {event.actor}</p>}
                    {event.note && <p className="text-sm mt-1">{event.note}</p>}
                    {event.context && (
                      <p className="text-xs text-muted-foreground mt-1 break-all">{event.context}</p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
