import { DataTable, DataTableTab } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import React from "react";
import { getOrders } from "@/actions/order";
import { DeliveryDetail } from "@/types/order-types";
import { calculateOrderStats } from '@/lib/utils'
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const deliveryColumns: ColumnDef<{ id: string } & DeliveryDetail>[] = [
  { accessorKey: "id", header: "Delivery ID" },
  { accessorKey: "delivery.delivery_type", header: "Type", cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.delivery?.delivery_type}</Badge> },
  { accessorKey: "delivery.delivery_status", header: "Status", cell: ({ row }) => <Badge variant="outline">{row.original.delivery?.delivery_status}</Badge> },
  { accessorKey: "delivery.origin", header: "Origin", cell: ({ row }) => row.original.delivery?.origin },
  { accessorKey: "delivery.destination", header: "Destination", cell: ({ row }) => row.original.delivery?.destination },
  { accessorKey: "delivery.distance", header: "Distance", cell: ({ row }) => row.original.delivery?.distance },
  { accessorKey: "delivery.duration", header: "Duration", cell: ({ row }) => row.original.delivery?.duration },
  { accessorKey: "delivery.delivery_fee", header: "Fee", cell: ({ row }) => row.original.delivery?.delivery_fee },
  { accessorKey: "delivery.created_at", header: "Created At", cell: ({ row }) => row.original.delivery?.created_at },
];

const deliveryTabs: DataTableTab<{ id: string } & DeliveryDetail>[] = [
  { label: "All", value: "all" },
  { label: "Delivery", value: "delivery", filter: (row) => row.delivery?.delivery_type === "package" },
  { label: "Food", value: "food", filter: (row) => row.delivery?.delivery_type === "food" },
  { label: "Laundry", value: "laundry", filter: (row) => row.delivery?.delivery_type === "laundry" },
];

const Page = async () => {
  const result = await getOrders();
  if ("error" in result) {
    return <div>Error: {result.error}</div>;
  }
  const ordersWithId = result.map((item) => ({
    ...item,
    id: item.delivery?.id || item.order.id,
  }));
  const stats = calculateOrderStats(result);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards stats={stats} />
          <DataTable data={ordersWithId} columns={deliveryColumns} title="Deliveries" tabs={deliveryTabs} />
        </div>
      </div>
    </div>
  );
};

export default Page;
