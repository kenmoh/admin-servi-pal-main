import { DeliveryOrderSummary } from "@/types/delivery-types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

function statusColor(status: string) {
  switch (status?.toUpperCase()) {
    case "DELIVERED": return "bg-green-500/15 text-green-600"
    case "IN_TRANSIT":
    case "PICKED_UP": return "bg-blue-500/15 text-blue-600"
    case "PENDING": return "bg-yellow-500/15 text-yellow-600"
    case "CANCELLED": return "bg-red-500/15 text-red-600"
    default: return "bg-gray-500/15 text-gray-600"
  }
}

export const deliveryColumns: ColumnDef<DeliveryOrderSummary>[] = [
  {
    accessorKey: "order_number",
    header: "Order #",
  },
  {
    accessorKey: "package_name",
    header: "Package",
  },
  {
    accessorKey: "delivery_type",
    header: "Type",
  },
  {
    accessorKey: "delivery_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("delivery_status") as string
      return <Badge variant="secondary" className={statusColor(status)}>{status}</Badge>
    },
  },
  {
    accessorKey: "payment_status",
    header: "Payment",
  },
  {
    accessorKey: "delivery_fee",
    header: "Fee (₦)",
    cell: ({ row }) => parseFloat(row.getValue("delivery_fee")).toLocaleString(),
  },
  {
    accessorKey: "total_price",
    header: "Total (₦)",
    cell: ({ row }) => parseFloat(row.getValue("total_price")).toLocaleString(),
  },
  {
    accessorKey: "has_dispute",
    header: "Dispute",
    cell: ({ row }) => (row.getValue("has_dispute") ? "Yes" : "No"),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString()
    },
  },
]
