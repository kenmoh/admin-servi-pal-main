import { CommissionOut } from "@/types/commission-types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

function serviceColor(service: string) {
  switch (service?.toUpperCase()) {
    case "DELIVERY":
      return "bg-blue-500/15 text-blue-600";
    case "FOOD":
      return "bg-orange-500/15 text-orange-600";
    case "LAUNDRY":
      return "bg-purple-500/15 text-purple-600";
    case "PRODUCT":
      return "bg-green-500/15 text-green-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

function formatAmount(amount: string | number) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "—";
  return `₦${value.toLocaleString()}`;
}

function shortId(id?: string | null) {
  if (!id) return "—";
  return `${id.slice(0, 8)}…`;
}

export const commissionColumns: ColumnDef<CommissionOut>[] = [
  {
    accessorKey: "service_type",
    header: "Service",
    cell: ({ row }) => (
      <Badge variant="secondary" className={serviceColor(row.original.service_type)}>
        {row.original.service_type}
      </Badge>
    ),
  },
  {
    accessorKey: "commission_amount",
    header: "Commission",
    cell: ({ row }) => (
      <span className="font-medium">{formatAmount(row.original.commission_amount)}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.description || "—"}</span>
    ),
  },
  {
    accessorKey: "order_id",
    header: "Order",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{shortId(row.original.order_id)}</span>
    ),
  },
  {
    accessorKey: "from_user_id",
    header: "From",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{shortId(row.original.from_user_id)}</span>
    ),
  },
  {
    accessorKey: "to_user_id",
    header: "To",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{shortId(row.original.to_user_id)}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.created_at).toLocaleString()}
      </span>
    ),
  },
];