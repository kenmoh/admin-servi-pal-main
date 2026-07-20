import { TransferData } from "@/types/beneficiary-types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

function statusColor(status: string) {
  switch (status?.toUpperCase()) {
    case "SUCCESSFUL":
    case "SUCCESS":
      return "bg-green-500/15 text-green-600"
    case "PENDING":
    case "PENDING_RETRY":
      return "bg-yellow-500/15 text-yellow-600"
    case "FAILED":
      return "bg-red-500/15 text-red-600"
    case "INITIATING":
    case "NEW":
      return "bg-blue-500/15 text-blue-600"
    default:
      return "bg-gray-500/15 text-gray-600"
  }
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount)
}

export const transferColumns: ColumnDef<TransferData>[] = [
  {
    accessorKey: "full_name",
    header: "Recipient",
    cell: ({ row }) => row.original.full_name || "N/A",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatAmount(row.original.amount),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant="secondary" className={statusColor(status)}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.reference}</span>
    ),
  },
  {
    accessorKey: "bank_name",
    header: "Bank",
    cell: ({ row }) => row.original.bank_name || "N/A",
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
]
