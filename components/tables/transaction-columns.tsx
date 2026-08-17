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

function directionLabel(tx: TransactionItem): "DEBIT" | "CREDIT" | null {
  const label = tx.details?.label;
  return label === "DEBIT" || label === "CREDIT" ? label : null;
}

function description(tx: TransactionItem): string {
  const dir = directionLabel(tx);
  if (dir === "DEBIT") return tx.to_name ? `Paid to ${tx.to_name}` : "Payment";
  if (dir === "CREDIT") return tx.from_name ? `Received from ${tx.from_name}` : "Credit";
  return tx.transaction_type || "Transaction";
}

export const transactionColumns: ColumnDef<TransactionItem>[] = [
  {
    id: "description",
    header: "Description",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{description(row.original)}</p>
        <p className="text-xs text-muted-foreground font-mono">
          {row.original.tx_ref || "—"}
        </p>
      </div>
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
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const tx = row.original;
      const dir = directionLabel(tx);
      const sign = dir === "DEBIT" ? "−" : dir === "CREDIT" ? "+" : "";
      const cls =
        dir === "DEBIT"
          ? "text-red-600"
          : dir === "CREDIT"
            ? "text-green-600"
            : "";
      return (
        <span className={`font-semibold tabular-nums ${cls}`}>
          {sign}₦{tx.amount.toLocaleString()}
        </span>
      );
    },
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