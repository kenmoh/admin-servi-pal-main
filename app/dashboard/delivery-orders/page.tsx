"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequireDeliveryOrders } from "@/actions/order";
import { DeliveryOrderDataTable } from "@/components/delivery-order-data-table";
import { DeliveryDetail, PaginatedDeliveryDetailResponse } from "@/types/order-types";

export default function DeliveryOrdersPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Fetch paginated data
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedDeliveryDetailResponse | { error: string }>({
    queryKey: ["require-delivery-orders", page, pageSize],
    queryFn: async () => {
      const res = await getRequireDeliveryOrders(page * pageSize, pageSize);
      return res;
    },
    placeholderData: previousData => previousData,
  });

  const safeData = (data && "data" in data && "total" in data)
    ? data as PaginatedDeliveryDetailResponse
    : { data: [], total: 0, error: (data as any)?.error };

  const errorMsg = isError
    ? (error as Error)?.message || ("error" in safeData ? (safeData as any).error : undefined)
    : undefined;

  return (
    <div className="p-4">
      <DeliveryOrderDataTable
        data={safeData.data}
        loading={isLoading}
        error={errorMsg}
        total={safeData.total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(0);
        }}
      />
    </div>
  );
}
