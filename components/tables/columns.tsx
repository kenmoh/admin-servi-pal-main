"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type {
  Order,
  User,
  Vendor,
  FoodOrder,
  LaundryOrder,
  Complaint,
  ActivityLog,
  WalletTransaction,
} from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { safeToFixed } from "@/lib/utils"

// Helper function to create sortable headers
const createSortableHeader = (label: string) => ({
  header: ({ column }: any) => (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
})

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "userName",
    header: "Customer",
    cell: ({ row }) => <span className="font-medium">{row.getValue("userName")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "pending"
                ? "secondary"
                : status === "cancelled"
                  ? "destructive"
                  : "outline"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount")
      return <span className="font-semibold text-accent">${safeToFixed(amount, 2)}</span>
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string
      return <Badge variant={status === "completed" ? "default" : "secondary"}>{status}</Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("createdAt") as Date).toLocaleDateString(),
  },
]


export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "User ID",
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-xs">{row.getValue("email")}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant="outline" className="capitalize">
          {role.replace(/_/g, " ")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "active" ? "default" : status === "inactive" ? "secondary" : "destructive"}
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.getValue("createdAt") as Date).toLocaleDateString(),
  },
]

export const vendorColumns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "businessName",
    header: "Business Name",
    cell: ({ row }) => <span className="font-medium">{row.getValue("businessName")}</span>,
  },
  {
    accessorKey: "businessType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("businessType") as string
      return (
        <Badge variant="outline" className="capitalize">
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number
      return <span className="font-semibold">{rating} ⭐</span>
    },
  },
  {
    accessorKey: "totalOrders",
    header: "Orders",
    cell: ({ row }) => <span className="text-center">{row.getValue("totalOrders")}</span>,
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => {
      const revenue = row.getValue("revenue") as number
      return <span className="font-semibold">${revenue.toLocaleString()}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "active" ? "default" : status === "inactive" ? "secondary" : "destructive"}
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
]

export const foodOrderColumns: ColumnDef<FoodOrder>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "restaurantName",
    header: "Restaurant",
    cell: ({ row }) => <span className="font-medium">{row.getValue("restaurantName")}</span>,
  },
  {
    accessorKey: "cuisineType",
    header: "Cuisine",
    cell: ({ row }) => <span className="text-sm capitalize">{row.getValue("cuisineType")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "pending"
                ? "secondary"
                : status === "cancelled"
                  ? "destructive"
                  : "outline"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount")
      return <span className="font-semibold text-accent">${safeToFixed(amount, 2)}</span>
    },
  },
]

export const laundryOrderColumns: ColumnDef<LaundryOrder>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "laundryName",
    header: "Laundry Service",
    cell: ({ row }) => <span className="font-medium">{row.getValue("laundryName")}</span>,
  },
  {
    accessorKey: "serviceType",
    header: "Service",
    cell: ({ row }) => {
      const service = row.getValue("serviceType") as string
      return (
        <Badge variant="outline" className="capitalize">
          {service?.replace(/_/g, " ")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "pending"
                ? "secondary"
                : status === "cancelled"
                  ? "destructive"
                  : "outline"
          }
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row }) => {
      const weight = row.getValue("weight")
      return <span className="text-sm">{safeToFixed(weight, 2)} kg</span>
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount")
      return <span className="font-semibold text-accent">${safeToFixed(amount, 2)}</span>
    },
  },
]

export const complaintColumns: ColumnDef<Complaint>[] = [
  {
    accessorKey: "id",
    header: "Ticket ID",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <span className="font-medium">{row.getValue("subject")}</span>,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      return (
        <Badge
          variant={priority === "high" ? "destructive" : priority === "medium" ? "secondary" : "outline"}
          className="capitalize"
        >
          {priority}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "resolved" ? "default" : status === "open" ? "destructive" : "secondary"}
          className="capitalize"
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("createdAt") as Date).toLocaleDateString(),
  },
]

export const activityLogColumns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string
      return (
        <Badge variant="outline" className="capitalize">
          {action}
        </Badge>
      )
    },
  },
  {
    accessorKey: "entityType",
    header: "Entity Type",
    cell: ({ row }) => {
      const type = row.getValue("entityType") as string
      return <span className="capitalize">{type}</span>
    },
  },
  {
    accessorKey: "entityId",
    header: "Entity ID",
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("entityId")}</span>,
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => new Date(row.getValue("timestamp") as Date).toLocaleString(),
  },
]

export const walletTransactionColumns: ColumnDef<WalletTransaction>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <Badge variant={type === "credit" ? "default" : "secondary"} className="capitalize">
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount")
      const type = row.original.type
      return (
        <span className={`font-semibold ${type === "credit" ? "text-green-600" : "text-red-600"}`}>
          {type === "credit" ? "+" : "-"}₦{safeToFixed((Number(amount) || 0) * 1500, 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </span>
      )
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string
      return (
        <Badge variant="outline" className="capitalize">
          {reason.replace(/_/g, " ")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "balanceAfter",
    header: "Balance After",
    cell: ({ row }) => {
      const balance = row.getValue("balanceAfter")
      return <span className="font-semibold text-accent">₦{safeToFixed((Number(balance) || 0) * 1500, 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      return new Date(date).toLocaleDateString()
    },
  },
]
