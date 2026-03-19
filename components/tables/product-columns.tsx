"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ProductOrderSummary } from "@/types/product-types";

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

export const productColumns: ColumnDef<ProductOrderSummary>[] = [
  {
    accessorKey: "order_number",
    header: "Order #",
    cell: ({ row }) => (
      <span className="font-mono">{row.original.order_number || "N/A"}</span>
    ),
  },
  {
    accessorKey: "order_status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={statusColor(row.original.order_status || "")}
        variant="secondary"
      >
        {row.original.order_status || "UNKNOWN"}
      </Badge>
    ),
  },
  {
    accessorKey: "grand_total",
    header: "Total (₦)",
    cell: ({ row }) => row.original.grand_total?.toLocaleString() ?? 0,
  },
  {
    accessorKey: "payment_status",
    header: "Payment",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.payment_status || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "escrow_status",
    header: "Escrow",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.escrow_status || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    ),
  },
];
