"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useAppContext } from "@/lib/context";
import { X, MapPin, User, Store, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { LaundryOrderDetail } from "@/types/laundry-types";
import Image from "next/image";

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

function SectionSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

function statusColor(status: string) {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
    case "COMPLETED":
      return "bg-green-500/15 text-green-600";
    case "IN_TRANSIT":
    case "PICKED_UP":
    case "IN_PROGRESS":
      return "bg-blue-500/15 text-blue-600";
    case "PENDING":
      return "bg-yellow-500/15 text-yellow-600";
    case "CANCELLED":
      return "bg-red-500/15 text-red-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

export function LaundryDetailDrawer() {
  const { selectedLaundryOrder, setSelectedLaundryOrder } = useAppContext();

  const {
    data: detail,
    isLoading,
    isError,
  } = useQuery<LaundryOrderDetail>({
    queryKey: ["laundry-detail", selectedLaundryOrder?.id],
    queryFn: async () => {
      const response = await fetch(`/api/laundry/${selectedLaundryOrder!.id}`);
      if (!response.ok) throw new Error("Failed to fetch laundry details");
      return response.json();
    },
    enabled: !!selectedLaundryOrder,
  });

  if (!selectedLaundryOrder) return null;

  return (
    <Drawer
      open={!!selectedLaundryOrder}
      onOpenChange={(open) => !open && setSelectedLaundryOrder(null)}
      direction="right"
    >
      <DrawerContent className="max-w-md h-full right-0 left-auto top-0 bottom-0 rounded-none border-l">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Laundry Details</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Summary — always available immediately */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Info className="w-4 h-4" />
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <DetailRow
                label="Order #"
                value={selectedLaundryOrder.order_number}
              />
              <DetailRow
                label="Laundry Type"
                value={<span className="capitalize">{selectedLaundryOrder.laundry_type}</span>}
              />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className={statusColor(selectedLaundryOrder.order_status || '')}
                  variant="secondary"
                >
                  {selectedLaundryOrder.order_status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <Badge variant="outline">
                  {selectedLaundryOrder.payment_status || "N/A"}
                </Badge>
              </div>
              <DetailRow
                label="Delivery Fee"
                value={`₦${selectedLaundryOrder.delivery_fee.toLocaleString()}`}
              />
              <DetailRow
                label="Subtotal"
                value={`₦${selectedLaundryOrder.subtotal.toLocaleString()}`}
              />
              <DetailRow
                label="Total Price"
                value={`₦${selectedLaundryOrder.grand_total.toLocaleString()}`}
              />
              <DetailRow
                label="Vendor Due"
                value={`₦${selectedLaundryOrder.amount_due_vendor.toLocaleString()}`}
              />
              <DetailRow
                label="Require Delivery"
                value={selectedLaundryOrder.require_delivery ? "Yes" : "No"}
              />
              <DetailRow
                label="Has Dispute"
                value={selectedLaundryOrder.has_dispute ? "Yes" : "No"}
              />
              <DetailRow
                label="Created"
                value={new Date(
                  selectedLaundryOrder.created_at,
                ).toLocaleDateString()}
              />
            </div>
          </div>

          <Separator />

          {/* Detail sections — loaded from API */}
          {isLoading ? (
            <div className="space-y-6">
              <SectionSkeleton />
              <Separator />
              <SectionSkeleton />
              <Separator />
              <SectionSkeleton />
            </div>
          ) : isError ? (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded">
              Failed to load laundry order details. Please try again.
            </div>
          ) : detail ? (
            <>
              {/* Customer Info */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer
                </h3>
                <div className="space-y-2 text-sm">
                  {detail.customer && (
                    <div className="flex items-center gap-3 mb-2">
                      {detail.customer.profile_image_url && (
                        <Image
                          src={detail.customer.profile_image_url}
                          alt="Customer"
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium">
                        {detail.customer.full_name || "N/A"}
                      </span>
                    </div>
                  )}
                  <DetailRow
                    label="Phone"
                    value={detail.customer?.phone_number}
                    mono
                  />
                  <DetailRow
                    label="Email"
                    value={detail.customer?.email}
                  />
                </div>
              </div>

              <Separator />

              {/* Vendor Info */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Vendor
                </h3>
                {detail.vendor ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3 mb-2">
                      {detail.vendor.profile_image_url && (
                        <Image
                          src={detail.vendor.profile_image_url}
                          alt="Vendor"
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium">
                        {detail.vendor.business_name || "N/A"}
                      </span>
                    </div>
                    <DetailRow
                      label="Phone"
                      value={detail.vendor.phone_number}
                      mono
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No vendor assigned
                  </p>
                )}
              </div>

              <Separator />

              {/* Locations */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  Locations and Distance
                </h3>
                <div className="space-y-2 text-sm">
                  <DetailRow label="Pickup" value={detail.pickup_location} />
                  <DetailRow label="Dropoff" value={detail.destination} />
                  <DetailRow label="Distance" value={detail.distance ? `${detail.distance.toFixed(1)} km` : null} />
                </div>
              </div>

              {/* Additional Information */}
              {detail.additional_info && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Additional Info</h3>
                    <p className="text-sm text-muted-foreground">
                      {detail.additional_info}
                    </p>
                  </div>
                </>
              )}

              {/* Cancellation info */}
              {detail.cancel_reason && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-500">
                      Cancellation
                    </h3>
                    <div className="space-y-2 text-sm">
                      <DetailRow
                        label="Reason"
                        value={detail.cancel_reason}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
