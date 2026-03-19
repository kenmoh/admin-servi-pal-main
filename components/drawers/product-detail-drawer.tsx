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
import { ProductOrderDetail } from "@/types/product-types";
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
    case "SHIPPED":
    case "IN_PROGRESS":
      return "bg-blue-500/15 text-blue-600";
    case "PENDING":
      return "bg-yellow-500/15 text-yellow-600";
    case "CANCELLED":
    case "RETURNED":
      return "bg-red-500/15 text-red-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

export function ProductDetailDrawer() {
  const { selectedProductOrder, setSelectedProductOrder } = useAppContext();

  const {
    data: detail,
    isLoading,
    isError,
  } = useQuery<ProductOrderDetail>({
    queryKey: ["product-detail", selectedProductOrder?.id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${selectedProductOrder!.id}`);
      if (!response.ok) throw new Error("Failed to fetch product details");
      return response.json();
    },
    enabled: !!selectedProductOrder,
  });

  if (!selectedProductOrder) return null;

  return (
    <Drawer
      open={!!selectedProductOrder}
      onOpenChange={(open) => !open && setSelectedProductOrder(null)}
      direction="right"
    >
      <DrawerContent className="max-w-md h-full right-0 left-auto top-0 bottom-0 rounded-none border-l">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>Marketplace Order Details</DrawerTitle>
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
                value={selectedProductOrder.order_number}
              />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className={statusColor(selectedProductOrder.order_status || '')}
                  variant="secondary"
                >
                  {selectedProductOrder.order_status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <Badge variant="outline">
                  {selectedProductOrder.payment_status || "N/A"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Escrow</span>
                <Badge variant="secondary">
                  {selectedProductOrder.escrow_status || "N/A"}
                </Badge>
              </div>
              <DetailRow
                label="Shipping Cost"
                value={`₦${selectedProductOrder.shipping_cost.toLocaleString()}`}
              />
              <DetailRow
                label="Total Price"
                value={`₦${selectedProductOrder.grand_total.toLocaleString()}`}
              />
              <DetailRow
                label="Vendor Due"
                value={`₦${selectedProductOrder.amount_due_vendor.toLocaleString()}`}
              />
              <DetailRow
                label="Delivery Option"
                value={<span className="capitalize">{selectedProductOrder.delivery_option}</span>}
              />
              <DetailRow
                label="Has Dispute"
                value={selectedProductOrder.has_dispute ? "Yes" : "No"}
              />
              <DetailRow
                label="Created"
                value={new Date(
                  selectedProductOrder.created_at,
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
              Failed to load product order details. Please try again.
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
                    <div className="flex items-center gap-3 mb-2 w-18.75 h-18.75 overflow-hidden rounded-full">
                      {detail.customer.profile_image_url && (
                        <Image
                          src={detail.customer.profile_image_url}
                          alt="Customer"
                          width={75}
                          height={75}
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
                    <div className="flex items-center gap-3 mb-2 w-18.75 h-18.75 rounded-full overflow-hidden">
                      {detail.vendor.profile_image_url && (
                        <Image
                          src={detail.vendor.profile_image_url}
                          alt="Vendor"
                          width={75}
                          height={75}
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
                    No vendor assigned
                  </p>
                )}
              </div>

              <Separator />

              {/* Delivery Address */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  Delivery Address
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{detail.delivery_address || "N/A"}</p>
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
                        <div key={item.id} className="flex gap-3 text-sm border p-3 rounded-lg">
                          {item.images && item.images[0] && (
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="rounded object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <div className="flex justify-between text-muted-foreground mt-1">
                              <span>Qty: {item.quantity}</span>
                              <span className="font-medium text-foreground">₦{item.price.toLocaleString()}</span>
                            </div>
                            {(item.selected_size?.length || item.selected_color?.length) ? (
                              <div className="text-xs text-muted-foreground mt-1">
                                {item.selected_size?.join(", ")} {item.selected_color?.join(", ")}
                              </div>
                            ) : null}
                          </div>
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
