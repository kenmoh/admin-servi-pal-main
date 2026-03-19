"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useAppContext } from "@/lib/context";
import { X, MapPin, User, Package, Bike, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { DeliveryOrderDetail } from "@/types/delivery-types";
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
      return "bg-green-500/15 text-green-600";
    case "IN_TRANSIT":
    case "PICKED_UP":
      return "bg-blue-500/15 text-blue-600";
    case "PENDING":
      return "bg-yellow-500/15 text-yellow-600";
    case "CANCELLED":
      return "bg-red-500/15 text-red-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

export function DeliveryDetailDrawer() {
  const { selectedDelivery, setSelectedDelivery } = useAppContext();

  const {
    data: detail,
    isLoading,
    isError,
  } = useQuery<DeliveryOrderDetail>({
    queryKey: ["delivery-detail", selectedDelivery?.id],
    queryFn: async () => {
      const response = await fetch(`/api/deliveries/${selectedDelivery!.id}`);
      if (!response.ok) throw new Error("Failed to fetch delivery details");
      return response.json();
    },
    enabled: !!selectedDelivery,
  });

  if (!selectedDelivery) return null;

  return (
    <Drawer
      open={!!selectedDelivery}
      onOpenChange={(open) => !open && setSelectedDelivery(null)}
      direction="right"
    
    >
      <DrawerContent className="max-w-md h-full right-0 left-auto top-0 bottom-0 rounded-none border-none">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Delivery Details</DrawerTitle>
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
              <Package className="w-4 h-4" />
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <DetailRow
                label="Order #"
                value={selectedDelivery.order_number}
              />
              <DetailRow
                label="Package"
                value={selectedDelivery.package_name}
              />
              <DetailRow
                label="Type"
                value={selectedDelivery.delivery_type}
              />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className={statusColor(selectedDelivery.delivery_status)}
                  variant="secondary"
                >
                  {selectedDelivery.delivery_status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <Badge variant="outline">
                  {selectedDelivery.payment_status || "N/A"}
                </Badge>
              </div>
              <DetailRow
                label="Delivery Fee"
                value={`₦${selectedDelivery.delivery_fee.toLocaleString()}`}
              />
              <DetailRow
                label="Total Price"
                value={`₦${selectedDelivery.total_price.toLocaleString()}`}
              />
              <DetailRow
                label="Dispute"
                value={selectedDelivery.has_dispute ? "Yes" : "No"}
              />
              <DetailRow
                label="Created"
                value={new Date(
                  selectedDelivery.created_at,
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
              Failed to load delivery details. Please try again.
            </div>
          ) : detail ? (
            <>
              {/* Sender Info */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Sender
                </h3>
                <div className="space-y-2 text-sm">
                  {detail.sender && (
                    <div className="flex items-center gap-3 mb-2 h-18.75 w-18.75 overflow-hidden rounded-full">
                      {detail.sender.profile_image_url && (
                        <Image
                          src={detail.sender.profile_image_url}
                          alt="Sender"
                          width={75}
                          height={75}
                          className="rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium">
                        {detail.sender.full_name || "N/A"}
                      </span>
                    </div>
                  )}
                  <DetailRow
                    label="Phone"
                    value={detail.sender_phone_number}
                    mono
                  />
                  <DetailRow
                    label="Email"
                    value={detail.sender?.email}
                  />
                </div>
              </div>

              <Separator />

              {/* Rider Info */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bike className="w-4 h-4" />
                  Rider
                </h3>
                {detail.rider ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3 rounded-full overflow-hidden mb-2 h-18.75 w-18.75">
                      {detail.rider.profile_image_url && (
                        <Image
                          src={detail.rider.profile_image_url}
                          alt="Rider"
                          width={75}
                          height={75}
                          className="rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium">
                        {detail.rider.full_name || "N/A"}
                      </span>
                      
                    </div>
                    <DetailRow
                      label="Phone"
                      value={detail.rider_phone_number}
                      mono
                    />
                    <DetailRow
                      label="Bike #"
                      value={detail.rider.bike_number}
                    />
                    <DetailRow
                      label="Company"
                      value={detail.rider.business_name}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No rider assigned
                  </p>
                )}
              </div>

              <Separator />

              {/* Pickup Location */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  Pickup
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{detail.pickup_location}</p>
                </div>
              </div>

              <Separator />

              {/* Destination */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Destination
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{detail.destination}</p>
                  <DetailRow
                    label="Receiver Phone"
                    value={detail.receiver_phone}
                    mono
                  />
                </div>
              </div>

              <Separator />

              {/* Trip Details */}
              <div className="space-y-2">
                <h3 className="font-semibold">Trip Details</h3>
                <div className="space-y-2 text-sm">
                  <DetailRow
                    label="Distance"
                    value={
                      detail.distance
                        ? `${detail.distance} km`
                        : null
                    }
                  />
                  <DetailRow label="Duration" value={detail.duration} />
                  <DetailRow
                    label="Description"
                    value={detail.description}
                  />
                  <DetailRow
                    label="Additional Info"
                    value={detail.additional_info}
                  />
                </div>
              </div>

              {/* Package Image */}
              {detail.package_image_url && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Package Image</h3>
                    <Image
                      src={detail.package_image_url}
                      alt="Package"
                      width={400}
                      height={250}
                      className="rounded-lg object-cover w-full"
                    />
                  </div>
                </>
              )}

              {/* Cancellation info */}
              {detail.cancelled_by && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-500">
                      Cancellation
                    </h3>
                    <div className="space-y-2 text-sm">
                      <DetailRow
                        label="Cancelled By"
                        value={detail.cancelled_by}
                      />
                      <DetailRow
                        label="Reason"
                        value={detail.cancel_reason}
                      />
                      <DetailRow
                        label="Cancelled At"
                        value={
                          detail.cancelled_at
                            ? new Date(
                                detail.cancelled_at,
                              ).toLocaleString()
                            : null
                        }
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
