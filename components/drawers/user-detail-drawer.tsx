"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useAppContext } from "@/lib/context";
import { X, User, Star, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { safeToFixed } from "@/lib/utils";
import { ProfileDetail } from "@/types/user-types";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  if (!value) return null;
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
    case "ACTIVE":
      return "bg-green-500/15 text-green-600";
    case "PENDING":
      return "bg-yellow-500/15 text-yellow-600";
    case "SUSPENDED":
      return "bg-orange-500/15 text-orange-600";
    case "DELETED":
      return "bg-red-500/15 text-red-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

export function UserDetailDrawer() {
  const { selectedProfile, setSelectedProfile } = useAppContext();

  const queryClient = useQueryClient();
  const [blockReason, setBlockReason] = useState("Administrative action");

  const {
    data: detail,
    isLoading,
    isError,
  } = useQuery<ProfileDetail>({
    queryKey: ["user-detail", selectedProfile?.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${selectedProfile!.id}`);
      if (!response.ok) throw new Error("Failed to fetch user details");
      return response.json();
    },
    enabled: !!selectedProfile,
  });

  const blockMutation = useMutation({
    mutationFn: async ({
      id,
      isBlocked,
      reason,
    }: {
      id: string;
      isBlocked: boolean;
      reason: string;
    }) => {
      const response = await fetch(`/api/users/${id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to toggle block status");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(
        data.is_blocked
          ? "User blocked successfully"
          : "User unblocked successfully",
      );
      queryClient.invalidateQueries({
        queryKey: ["user-detail", selectedProfile?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (!selectedProfile) return null;

  return (
    <Drawer
      open={!!selectedProfile}
      onOpenChange={(open) => !open && setSelectedProfile(null)}
      direction="right"
    >
      <DrawerContent className="max-w-md h-full right-0 left-auto top-0 bottom-0 rounded-none border-none">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>User Details</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Summary — always available */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {selectedProfile.profile_image_url ? (
                <Image
                  src={selectedProfile.profile_image_url}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">
                  {selectedProfile.full_name || "N/A"}
                </p>
                <Badge variant="outline">{selectedProfile.user_type}</Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant="secondary"
                  className={statusColor(selectedProfile.account_status)}
                >
                  {selectedProfile.account_status}
                </Badge>
              </div>
              <DetailRow label="Email" value={selectedProfile.email} />
              <DetailRow
                label="Phone"
                value={selectedProfile.phone_number}
                mono
              />
              <DetailRow
                label="Verified"
                value={selectedProfile.is_verified ? "Yes" : "No"}
              />
              <DetailRow
                label="Online"
                value={selectedProfile.is_online ? "Online" : "Offline"}
              />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  {safeToFixed(selectedProfile.average_rating, 1)} (
                  {selectedProfile.review_count})
                </span>
              </div>
              <DetailRow
                label="Joined"
                value={new Date(
                  selectedProfile.created_at,
                ).toLocaleDateString()}
              />
            </div>
          </div>

          <Separator />

          {/* Detail — loaded from API */}
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ) : isError ? (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded">
              Failed to load user details.
            </div>
          ) : detail ? (
            <>
              {/* Profile Details */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile
                </h3>
                <div className="space-y-2 text-sm">
                  <DetailRow
                    label="Business Name"
                    value={detail.business_name}
                  />
                  <DetailRow label="Store Name" value={detail.store_name} />
                  <DetailRow
                    label="Business Address"
                    value={detail.business_address}
                  />
                  <DetailRow label="State" value={detail.state} />
                  <DetailRow label="Bike #" value={detail.bike_number} />
                </div>
              </div>

              {(detail.bank_name || detail.bank_account_number) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Bank Details</h3>
                    <div className="space-y-2 text-sm">
                      <DetailRow label="Bank" value={detail.bank_name} />
                      <DetailRow
                        label="Account #"
                        value={detail.bank_account_number}
                        mono
                      />
                      <DetailRow
                        label="Account Name"
                        value={detail.account_holder_name}
                      />
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold">Activity</h3>
                <div className="space-y-2 text-sm">
                  <DetailRow
                    label="Total Deliveries"
                    value={detail.total_delivery_count}
                  />
                  <DetailRow
                    label="Daily Deliveries"
                    value={detail.daily_delivery_count}
                  />
                  <DetailRow
                    label="Distance Travelled"
                    value={
                      detail.total_distance_travelled
                        ? `${detail.total_distance_travelled} km`
                        : null
                    }
                  />
                  <DetailRow
                    label="Order Cancels"
                    value={detail.order_cancel_count}
                  />
                  <DetailRow
                    label="Last Seen"
                    value={
                      detail.last_seen_at
                        ? new Date(detail.last_seen_at).toLocaleString()
                        : null
                    }
                  />
                  <DetailRow
                    label="Last Delivery"
                    value={
                      detail.last_delivery_date
                        ? new Date(
                            detail.last_delivery_date,
                          ).toLocaleDateString()
                        : null
                    }
                  />
                </div>
              </div>

              {detail.suspension_end_date && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-500">
                      Suspension
                    </h3>
                    <div className="space-y-2 text-sm">
                      <DetailRow
                        label="Ends At"
                        value={new Date(
                          detail.suspension_end_date,
                        ).toLocaleDateString()}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>

        {detail && (
          <div className="p-4 border-t mt-auto bg-muted/30">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-2">
                  {detail.is_blocked
                    ? "User is currently blocked"
                    : "User is active"}
                </p>
                {detail.is_blocked ? (
                  <Button
                    variant="outline"
                    className="w-full border-green-600/50 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                    onClick={() =>
                      blockMutation.mutate({
                        id: detail.id,
                        isBlocked: true,
                        reason: "Unblocking",
                      })
                    }
                    disabled={blockMutation.isPending}
                  >
                    {blockMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 mr-2" />
                    )}
                    Unblock User
                  </Button>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full"
                        disabled={blockMutation.isPending}
                      >
                        {blockMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 mr-2" />
                        )}
                        Block User
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Block User
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Specify a reason for blocking this user.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="reason">Reason</Label>
                          <Input
                            id="reason"
                            value={blockReason}
                            onChange={(e) => setBlockReason(e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            blockMutation.mutate({
                              id: detail.id,
                              isBlocked: false,
                              reason: blockReason,
                            });
                          }}
                        >
                          Confirm Block
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
