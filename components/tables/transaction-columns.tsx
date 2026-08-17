import { TransactionItem } from "@/types/user-types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

function statusColor(status: string) {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
    case "COMPLETED":
      return "bg-green-500/15 text-green-600";
    case "PENDING":
      return "bg-yellow-500/15 text-yellow-600";
    case "FAILED":
      return "bg-red-500/15 text-red-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

export const transactionColumns: ColumnDef<TransactionItem>[] = [
  {
    accessorKey: "tx_ref",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.tx_ref || "—"}</span>
    ),
  },
  {
    accessorKey: "transaction_type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.transaction_type}</Badge>
    ),
  },
  {
    accessorKey: "details",
    header: "Direction",
    cell: ({ row }) => {
      const label = row.original.details?.label;
      if (label === "DEBIT") {
        return (
          <Badge variant="secondary" className="bg-red-500/15 text-red-600">
            DEBIT
          </Badge>
        );
      }
      if (label === "CREDIT") {
        return (
          <Badge variant="secondary" className="bg-green-500/15 text-green-600">
            CREDIT
          </Badge>
        );
      }
      return <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "from_name",
    header: "From",
    cell: ({ row }) => row.original.from_name || "—",
  },
  {
    accessorKey: "to_name",
    header: "To",
    cell: ({ row }) => row.original.to_name || "—",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `₦${row.original.amount.toLocaleString()}`,
  },
  {
    accessorKey: "payment_status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className={statusColor(row.original.payment_status || "")}
      >
        {row.original.payment_status || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
];
