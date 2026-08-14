import { FlutterwaveTransactionListItem } from "@/types/transaction-types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

function statusColor(status: string) {
  switch (status?.toUpperCase()) {
    case "SUCCESSFUL":
    case "SUCCESS":
      return "bg-green-500/15 text-green-600";
    case "PENDING":
      return "bg-yellow-500/15 text-yellow-600";
    case "FAILED":
      return "bg-red-500/15 text-red-600";
    default:
      return "bg-gray-500/15 text-gray-600";
  }
}

function formatAmount(amount: string | null, currency: string) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
  }).format(value);
}

export const flutterwaveTransactionsColumns: ColumnDef<FlutterwaveTransactionListItem>[] =
  [
    {
      accessorKey: "tx_ref",
      header: "Reference",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.tx_ref || "—"}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) =>
        formatAmount(row.original.amount, row.original.currency),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={statusColor(row.original.status)}
        >
          {row.original.status || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "payment_type",
      header: "Payment Type",
      cell: ({ row }) => row.original.payment_type || "—",
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) =>
        row.original.customer_name || row.original.customer_email || "—",
    },
    {
      accessorKey: "narration",
      header: "Narration",
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-56">{row.original.narration || "—"}</span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) =>
        row.original.created_at
          ? new Date(row.original.created_at).toLocaleString()
          : "—",
    },
  ];
