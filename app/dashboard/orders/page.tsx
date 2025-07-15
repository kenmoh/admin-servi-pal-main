"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPickupOrders } from "@/actions/order";
import { PickupOrderDataTable } from "@/components/delivery-data-table";
import { DeliveryDetail, PaginatedDeliveryDetailResponse } from "@/types/order-types";

export default function PickupOrdersPage() {
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
      const res = await getPickupOrders(page * pageSize, pageSize);
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
      <PickupOrderDataTable
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





// "use client";

// import { DeliveryDataTable } from "@/components/delivery-data-table";
// import React from "react";
// import { getOrders } from "@/actions/order";
// import { useQuery } from "@tanstack/react-query";
// import { Skeleton } from "@/components/ui/skeleton";

// const Page = () => {
//   const { data: orders, isLoading, error } = useQuery({
//     queryKey: ['orders'],
//     queryFn: getOrders,
//   });

//   if (isLoading) {
//     return (
//       <div className="flex flex-1 flex-col">
//         <div className="@container/main flex flex-1 flex-col gap-2">
//           <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//             <div className="space-y-4 px-8">
//               <Skeleton className="h-8 w-48" />
//               <Skeleton className="h-10 w-full" />
//               <div className="space-y-2">
//                 {Array.from({ length: 10 }).map((_, i) => (
//                   <Skeleton key={i} className="h-12 w-full" />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div>Error: {String(error)}</div>;
//   }

//   if (!orders || !Array.isArray(orders)) {
//     return <div>Error: {String(orders?.error || "Failed to load orders")}</div>;
//   }

//   return (
//     <div className="flex flex-1 flex-col">
//       <div className="@container/main flex flex-1 flex-col gap-2">
//         <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//           <DeliveryDataTable data={orders} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;