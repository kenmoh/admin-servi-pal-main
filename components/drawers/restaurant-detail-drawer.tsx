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
import { safeToFixed } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FoodOrderDetail } from "@/types/restaurant-types";
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
    case "PREPARING":
      return "bg-blue-500/15 text-blue-600";
    case "PENDING":
    case "ACCEPTED":
      return "bg-yellow-500/15 text-yellow-600";
    case "CANCELLED":
    case "REJECTED":
      return "bg-red-500/15 text-red-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

export function RestaurantDetailDrawer() {
  const { selectedFoodOrder, setSelectedFoodOrder } = useAppContext();

  const {
    data: detail,
    isLoading,
    isError,
  } = useQuery<FoodOrderDetail>({
    queryKey: ["restaurant-detail", selectedFoodOrder?.id],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${selectedFoodOrder!.id}`);
      if (!response.ok) throw new Error("Failed to fetch restaurant details");
      return response.json();
    },
    enabled: !!selectedFoodOrder,
  });

  if (!selectedFoodOrder) return null;

  return (
    <Drawer
      open={!!selectedFoodOrder}
      onOpenChange={(open) => !open && setSelectedFoodOrder(null)}
      direction="right"
    >
      <DrawerContent className="max-w-md h-full right-0 left-auto top-0 bottom-0 rounded-none border-l">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Restaurant Order Details</DrawerTitle>
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
                value={selectedFoodOrder.order_number}
              />
              <DetailRow
                label="Order Type"
                value={<span className="capitalize">{selectedFoodOrder.order_type}</span>}
              />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className={statusColor(selectedFoodOrder.order_status || '')}
                  variant="secondary"
                >
                  {selectedFoodOrder.order_status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <Badge variant="outline">
                  {selectedFoodOrder.payment_status || "N/A"}
                </Badge>
              </div>
              <DetailRow
                label="Delivery Fee"
                value={`₦${selectedFoodOrder.delivery_fee.toLocaleString()}`}
              />
              <DetailRow
                label="Subtotal"
                value={`₦${selectedFoodOrder.total_price.toLocaleString()}`}
              />
              <DetailRow
                label="Total Price"
                value={`₦${selectedFoodOrder.grand_total.toLocaleString()}`}
              />
              <DetailRow
                label="Vendor Due"
                value={`₦${selectedFoodOrder.amount_due_vendor.toLocaleString()}`}
              />
              <DetailRow
                label="Require Delivery"
                value={selectedFoodOrder.require_delivery ? "Yes" : "No"}
              />
              <DetailRow
                label="Has Dispute"
                value={selectedFoodOrder.has_dispute ? "Yes" : "No"}
              />
              <DetailRow
                label="Created"
                value={new Date(
                  selectedFoodOrder.created_at,
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
              Failed to load restaurant order details. Please try again.
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
                  Restaurant
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
                        {detail.vendor.store_name || detail.vendor.business_name || "N/A"}
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
                    No restaurant assigned
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
                  <DetailRow label="Distance" value={detail.distance ? `${safeToFixed(detail.distance, 1)} km` : null} />
                </div>
              </div>
              
              {/* Items List */}
              {detail.items && detail.items.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold">Order Items</h3>
                    <div className="space-y-3">
                      {detail.items.map((item) => (
                        <div key={item.id} className="text-sm border p-3 rounded-lg">
                          <div className="flex justify-between font-medium">
                            <span>Item #{item.item_id.substring(0, 8)}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                          {(item.sizes?.length > 0 || item.sides?.length > 0) && (
                            <div className="text-xs text-muted-foreground mt-2 space-y-1">
                              {item.sizes?.length > 0 && (
                                <p>Sizes: {item.sizes.map(s => s.name).join(', ')}</p>
                              )}
                              {item.sides?.length > 0 && (
                                <p>Sides: {item.sides.map(s => s.name).join(', ')}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

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
