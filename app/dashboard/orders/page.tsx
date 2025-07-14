"use client";

import { DeliveryDataTable } from "@/components/delivery-data-table";
import React from "react";
import { getOrders } from "@/actions/order";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-full" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  if (!orders || !Array.isArray(orders)) {
    return <div>Error: {String(orders?.error || "Failed to load orders")}</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DeliveryDataTable data={orders} />
        </div>
      </div>
    </div>
  );
};

export default Page;
