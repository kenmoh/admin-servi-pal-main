"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction, TransactionResponse } from "@/types/transaction-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Loader2 } from "lucide-react";

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
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-sm" : "font-medium"}>
        {value}
      </span>
    </div>
  );
}

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

function formatAmount(amount: string, currency: string) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
  }).format(value);
}

export function TransactionVerifyDialog({
  transaction,
  onClose,
}: {
  transaction: Transaction | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const txRef = transaction?.tx_ref ?? null;

  const {
    data: result,
    isLoading,
    isError,
  } = useQuery<TransactionResponse>({
    queryKey: ["transaction-verify", txRef],
    queryFn: async () => {
      const response = await fetch(`/api/transactions/${txRef}/verify`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to verify transaction");
      }
      const json = await response.json();
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      return json;
    },
    enabled: !!txRef,
    retry: false,
  });

  return (
    <Dialog open={!!transaction} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Verify Transaction</DialogTitle>
          </div>
          <DialogDescription>
            {txRef ? (
              <>
                Verifying reference{" "}
                <span className="font-mono">{txRef}</span> with the payment
                provider.
              </>
            ) : (
              "No transaction reference available to verify."
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : isError || !result ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Failed to verify this transaction. Please try again.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-lg">{result.data.tx_ref}</p>
                <Badge
                  variant="secondary"
                  className={statusColor(result.data.status)}
                >
                  {result.data.status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <DetailRow
                label="Amount"
                value={formatAmount(result.data.amount, result.data.currency)}
              />
              <DetailRow
                label="Charged Amount"
                value={formatAmount(
                  result.data.charged_amount,
                  result.data.currency,
                )}
              />
              <DetailRow
                label="App Fee"
                value={formatAmount(result.data.app_fee, result.data.currency)}
              />
              <DetailRow
                label="Merchant Fee"
                value={formatAmount(
                  result.data.merchant_fee,
                  result.data.currency,
                )}
              />
              <DetailRow
                label="Amount Settled"
                value={
                  result.data.amount_settled
                    ? formatAmount(
                        result.data.amount_settled,
                        result.data.currency,
                      )
                    : "—"
                }
              />
              <DetailRow label="Currency" value={result.data.currency} />
              <DetailRow
                label="Payment Type"
                value={result.data.payment_type}
              />
              <DetailRow label="Flutterwave Ref" value={result.data.flw_ref} mono />
              <DetailRow
                label="Processor Response"
                value={result.data.processor_response}
              />
            </div>

            {(result.data.card || result.data.customer) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                    Payment Details
                  </p>
                  <div className="space-y-2 text-sm">
                    {result.data.card && (
                      <>
                        <DetailRow
                          label="Card"
                          value={`**** **** **** ${result.data.card.last_4digits}`}
                          mono
                        />
                        <DetailRow label="Card Type" value={result.data.card.type} />
                        <DetailRow label="Issuer" value={result.data.card.issuer} />
                      </>
                    )}
                    {result.data.customer && (
                      <>
                        <DetailRow
                          label="Customer"
                          value={result.data.customer.name}
                        />
                        <DetailRow
                          label="Email"
                          value={result.data.customer.email}
                        />
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter showCloseButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}