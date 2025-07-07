"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { User } from "@/types/user-types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export const userColumns: ColumnDef<User>[] = [
  { accessorKey: "id", header: "User ID" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "user_type", header: "User Type", cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.user_type}</Badge> },
  { accessorKey: "phone_number", header: "Phone" },
  { accessorKey: "full_name", header: "Name" },
  { accessorKey: "business_name", header: "Business" },
  // Add more columns as needed
]

export function UserDataTable({ data }: { data: User[] }) {
  return <DataTable<User> data={data} columns={userColumns} title="Users" />
}