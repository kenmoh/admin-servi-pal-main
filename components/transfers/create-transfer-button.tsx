"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type OrderType =
  | "FOOD_ORDER"
  | "DELIVERY_ORDER"
  | "LAUNDRY_ORDER"
  | "PRODUCT_ORDER"
  | "RESTAURANT_RESERVATION";

const ACTIVE_STATUSES = new Set(["SUCCESSFUL", "SUCCESS", "INITIATING", "NEW", "PENDING", "PENDING_RETRY"]);

interface CreateTransferButtonProps {
  orderId: string;
  orderType: OrderType;
}

export function CreateTransferButton({ orderId, orderType }: CreateTransferButtonProps) {
  const queryClient = useQueryClient();

  const {
    data: statusData,
    isLoading: statusLoading,
  } = useQuery<{ reference: string | null; status: string | null }>({
    queryKey: ["payout-status", orderId, orderType],
    queryFn: async () => {
      const params = new URLSearchParams({ order_id: orderId, order_type: orderType });
      const response = await fetch(`/api/payouts/status?${params}`);
      if (!response.ok) throw new Error("Failed to fetch payout status");
      return response.json();
    },
    enabled: !!orderId && !!orderType,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/payouts/manual-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, order_type: orderType }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || err?.detail || "Failed to initiate transfer");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Transfer initiated successfully");
      queryClient.invalidateQueries({ queryKey: ["payout-status", orderId, orderType] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const status = statusData?.status;
  const disabled =
    statusLoading ||
    createMutation.isPending ||
    (!!status && ACTIVE_STATUSES.has(status.toUpperCase()));

  return (
    <div className="space-y-1">
      <Button
        variant="default"
        className="w-full"
        onClick={() => createMutation.mutate()}
        disabled={disabled}
      >
        {createMutation.isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        Create Transfer
      </Button>
      {status && (
        <p className="text-xs text-muted-foreground text-center">
          {disabled
            ? `Transfer already ${status.toLowerCase()}`
            : `Last status: ${status}`}
        </p>
      )}
    </div>
  );
}
