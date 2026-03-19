import { ProfileDetail, ProfileSummary } from "@/types/user-types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

function statusColor(status: string) {
  switch (status?.toUpperCase()) {
    case "ACTIVE": return "bg-green-500/15 text-green-600"
    case "PENDING": return "bg-yellow-500/15 text-yellow-600"
    case "SUSPENDED": return "bg-orange-500/15 text-orange-600"
    case "DELETED": return "bg-red-500/15 text-red-600"
    default: return "bg-gray-500/15 text-gray-600"
  }
}

export const userColumns: ColumnDef<ProfileDetail>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => row.original.full_name || "N/A",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email || "N/A",
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
  {
    accessorKey: "user_type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.user_type}</Badge>
    ),
  },
  {
    accessorKey: "account_status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="secondary" className={statusColor(row.original.account_status)}>
        {row.original.account_status}
      </Badge>
    ),
  },
  {
    accessorKey: "is_verified",
    header: "Verified",
    cell: ({ row }) => row.original.is_verified ? "Yes" : "No",
  },
  {
    accessorKey: "is_online",
    header: "Online",
    cell: ({ row }) => (
      <span className={row.original.is_online ? "text-green-600" : "text-muted-foreground"}>
        {row.original.is_online ? "Online" : "Offline"}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
]
