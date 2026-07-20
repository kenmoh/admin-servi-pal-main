import { BeneficiaryData } from "@/types/beneficiary-types"
import { ColumnDef } from "@tanstack/react-table"

export const beneficiaryColumns: ColumnDef<BeneficiaryData>[] = [
  {
    accessorKey: "full_name",
    header: "Full Name",
    cell: ({ row }) => row.original.full_name || "N/A",
  },
  {
    accessorKey: "account_number",
    header: "Account Number",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.account_number}</span>
    ),
  },
  {
    accessorKey: "bank_name",
    header: "Bank",
    cell: ({ row }) => row.original.bank_name || "N/A",
  },
  {
    accessorKey: "bank_code",
    header: "Bank Code",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.bank_code}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
]
