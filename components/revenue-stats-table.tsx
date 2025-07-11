"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RevenueStatsResponse } from "@/types/stats-types"
import { formatCurrency } from "@/lib/stats-utils"

interface RevenueStatsTableProps {
  revenueStats?: RevenueStatsResponse | null
}

export function RevenueStatsTable({ revenueStats }: RevenueStatsTableProps) {
  if (!revenueStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Statistics</CardTitle>
          <CardDescription>Daily revenue breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">No revenue data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show only the last 7 days for better display
  const displayData = revenueStats.data.slice(-7)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Statistics</CardTitle>
        <CardDescription>
          Daily revenue breakdown - {formatCurrency(revenueStats.summary.total_revenue)} total
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order Revenue</TableHead>
                <TableHead>Delivery Revenue</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Transactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((day, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{formatCurrency(day.order_revenue)}</TableCell>
                  <TableCell>{formatCurrency(day.delivery_revenue)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {formatCurrency(day.total_revenue)}
                    </Badge>
                  </TableCell>
                  <TableCell>{day.transaction_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Total Orders</p>
            <p className="font-medium">{formatCurrency(revenueStats.summary.order_revenue)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Total Deliveries</p>
            <p className="font-medium">{formatCurrency(revenueStats.summary.delivery_revenue)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Total Transactions</p>
            <p className="font-medium">{revenueStats.summary.total_transactions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
