"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from "recharts"
import { ComprehensiveStatsResponse } from "@/types/stats-types"
import { formatCurrency, formatNumber } from "@/lib/stats-utils"

interface FinancialAnalyticsDashboardProps {
  comprehensiveStats?: ComprehensiveStatsResponse | null
}

export function FinancialAnalyticsDashboard({ comprehensiveStats }: FinancialAnalyticsDashboardProps) {
  if (!comprehensiveStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Analytics</CardTitle>
          <CardDescription>Revenue and transactions insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">No financial data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { wallet_stats } = comprehensiveStats

  // Create mock revenue data for visualization (you can replace this with actual data)
  const revenueData = [
    { date: 'Mon', revenue: 15000 },
    { date: 'Tue', revenue: 18000 },
    { date: 'Wed', revenue: 22000 },
    { date: 'Thu', revenue: 19000 },
    { date: 'Fri', revenue: 25000 },
    { date: 'Sat', revenue: 30000 },
    { date: 'Sun', revenue: 28000 },
  ]

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`${label}`}</p>
          <p className="text-sm text-muted-foreground">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency("523750")}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(1250)}</div>
            <p className="text-xs text-muted-foreground">Transaction count</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(wallet_stats.total_wallet_balance)}</div>
            <p className="text-xs text-muted-foreground">Current wallet balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escrow Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(wallet_stats.total_escrow_balance)}</div>
            <p className="text-xs text-muted-foreground">Total held in escrow</p>
          </CardContent>
        </Card>
      </div>
   
    </div>
  )
}