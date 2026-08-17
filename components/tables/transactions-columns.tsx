import { Transaction } from "@/types/transaction-types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

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

function formatAmount(amount: string | null) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "—";
  return `₦${value.toLocaleString()}`;
}

function directionLabel(tx: Transaction): "DEBIT" | "CREDIT" | null {
  const label = tx.details?.label;
  return label === "DEBIT" || label === "CREDIT" ? label : null;
}

export function transactionsColumns(
  onVerify: (transaction: Transaction) => void,
): ColumnDef<Transaction>[] {
  return [
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
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const dir = directionLabel(row.original);
        const sign = dir === "DEBIT" ? "−" : dir === "CREDIT" ? "+" : "";
        const cls =
          dir === "DEBIT"
            ? "text-red-600"
            : dir === "CREDIT"
              ? "text-green-600"
              : "";
        return (
          <span className={`font-semibold tabular-nums ${cls}`}>
            {sign}
            {formatAmount(row.original.amount)}
          </span>
        );
      },
    },
    {
      accessorKey: "order_type",
      header: "Order Type",
      cell: ({ row }) =>
        row.original.order_type ? (
          <Badge variant="outline">{row.original.order_type}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
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
      cell: ({ row }) =>
        row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString()
          : "—",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const txRef = row.original.tx_ref;
        return (
          <Button
            variant="outline"
            size="sm"
            className="border-blue-600/50 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
            disabled={!txRef}
            onClick={(e) => {
              e.stopPropagation();
              onVerify(row.original);
            }}
          >
            <BadgeCheck className="w-3.5 h-3.5 mr-1" />
            Verify
          </Button>
        );
      },
    },
  ];
}