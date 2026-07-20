"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useAppContext } from "@/lib/context";
import { X, User, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TransferData } from "@/types/beneficiary-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function DetailRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-sm" : "font-medium"}>{value}</span>
    </div>
  );
}

function statusColor(status: string) {
  switch (status?.toUpperCase()) {
    case "SUCCESSFUL":
    case "SUCCESS":
      return "bg-green-500/15 text-green-600"
    case "PENDING":
    case "PENDING_RETRY":
      return "bg-yellow-500/15 text-yellow-600"
    case "FAILED":
      return "bg-red-500/15 text-red-600"
    case "INITIATING":
    case "NEW":
      return "bg-blue-500/15 text-blue-600"
    default:
      return "bg-gray-500/15 text-gray-600"
  }
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount)
}

export function TransferDetailDrawer() {
  const { selectedTransfer, setSelectedTransfer } = useAppContext();
  const queryClient = useQueryClient();

  const {
    data: detail,
    isLoading,
    isError,
  } = useQuery<TransferData>({
    queryKey: ["transfer-detail", selectedTransfer?.id],
    queryFn: async () => {
      const response = await fetch(`/api/payouts/${selectedTransfer!.id}`);
      if (!response.ok) throw new Error("Failed to fetch transfer details");
      const json = await response.json();
      return json.data;
    },
    enabled: !!selectedTransfer,
  });

  const retryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/payouts/${id}/retry`, { method: "POST" });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to retry transfer");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Transfer retry initiated successfully");
      queryClient.invalidateQueries({ queryKey: ["transfer-detail", selectedTransfer?.id] });
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!selectedTransfer) return null;

  const displayData = detail || selectedTransfer;
  const isFailed = displayData.status?.toUpperCase() === "FAILED";

  return (
    <Drawer
      open={!!selectedTransfer}
      onOpenChange={(open) => !open && setSelectedTransfer(null)}
      direction="right"
    >
      <DrawerContent className="max-w-md h-full right-0 left-auto top-0 bottom-0 rounded-none border-none">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Transfer Details</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">{displayData.full_name || "N/A"}</p>
                <Badge variant="secondary" className={statusColor(displayData.status)}>
                  {displayData.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <DetailRow label="Transfer ID" value={displayData.id} mono />
              <DetailRow label="Reference" value={displayData.reference} mono />
              <DetailRow label="Amount" value={formatAmount(displayData.amount)} />
              <DetailRow label="Fee" value={formatAmount(displayData.fee)} />
              <DetailRow label="Account Number" value={displayData.account_number} mono />
              <DetailRow label="Bank" value={displayData.bank_name} />
              <DetailRow label="Bank Code" value={displayData.bank_code} mono />
              <DetailRow label="Currency" value={displayData.currency} />
              <DetailRow label="Narration" value={displayData.narration} />
            </div>
          </div>

          {(displayData.complete_message || displayData.meta) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Additional Info</h3>
                <div className="space-y-2 text-sm">
                  {displayData.complete_message && (
                    <DetailRow label="Complete Message" value={displayData.complete_message} />
                  )}
                  {displayData.meta && (
                    <DetailRow label="Meta" value={displayData.meta} />
                  )}
                  <DetailRow label="Requires Approval" value={displayData.requires_approval ? "Yes" : "No"} />
                  <DetailRow label="Approved" value={displayData.is_approved ? "Yes" : "No"} />
                  <DetailRow
                    label="Date"
                    value={new Date(displayData.created_at).toLocaleString()}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="p-4 border-t">
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="p-4 border-t mt-auto bg-muted/30 space-y-2">
            <p className="text-xs text-muted-foreground">
              {isFailed ? "This transfer failed. You can retry it." : "Transfer completed successfully."}
            </p>
            {isFailed && (
              <Button
                variant="default"
                className="w-full"
                onClick={() => retryMutation.mutate(displayData.id)}
                disabled={retryMutation.isPending}
              >
                {retryMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Retry Transfer
              </Button>
            )}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
