"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ComprehensiveStatsResponse } from "@/types/stats-types"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatNumber, formatCurrency } from "@/lib/stats-utils"
import { Package, Truck, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface OperationalEfficiencyDashboardProps {
  comprehensiveStats?: ComprehensiveStatsResponse | null
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

const chartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-2))",
  },
  received: {
    label: "Received",
    color: "hsl(var(--chart-3))",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-4))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-5))",
  },
}

export function OperationalEfficiencyDashboard({ comprehensiveStats }: OperationalEfficiencyDashboardProps) {
  if (!comprehensiveStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operational Efficiency</CardTitle>
          <CardDescription>Order and delivery performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">No operational data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { order_status_distribution, delivery_stats, payment_method_distribution } = comprehensiveStats

  // Transform order status data for charts
  const orderStatusData = [
    { name: 'Pending', value: order_status_distribution.pending, color: '#FF8042' },
    { name: 'Delivered', value: order_status_distribution.delivered, color: '#00C49F' },
    { name: 'Received', value: order_status_distribution.received, color: '#0088FE' },
    { name: 'Rejected', value: order_status_distribution.rejected, color: '#FF4444' },
    { name: 'Cancelled', value: order_status_distribution.cancelled, color: '#888888' },
  ]

  // Transform payment method data
  const paymentMethodData = [
    { name: 'Wallet', value: payment_method_distribution.wallet, color: '#0088FE' },
    { name: 'Card', value: payment_method_distribution.card, color: '#00C49F' },
    { name: 'Bank Transfer', value: payment_method_distribution.bank_transfer, color: '#FFBB28' },
  ]

  // Calculate completion rate
  const completionRate = order_status_distribution.total > 0 
    ? ((order_status_distribution.delivered + order_status_distribution.received) / order_status_distribution.total) * 100
    : 0

  // Calculate delivery efficiency
  const deliveryEfficiency = delivery_stats.total_deliveries > 0
    ? (delivery_stats.completed_deliveries / delivery_stats.total_deliveries) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(order_status_distribution.total)}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Orders completed successfully</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Efficiency</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Deliveries completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {delivery_stats.average_delivery_time ? `${delivery_stats.average_delivery_time.toFixed(0)}m` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Average delivery time</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Order Status</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Stats</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Breakdown of orders by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: { name: string; percent?: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        // label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Processing Pipeline</CardTitle>
                <CardDescription>Order flow and bottlenecks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatusData.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                        <span className="text-sm font-medium">{status.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{formatNumber(status.value)}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {((status.value / order_status_distribution.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance Metrics</CardTitle>
              <CardDescription>Delivery statistics and KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Total Deliveries</p>
                  <p className="text-2xl font-bold">{formatNumber(delivery_stats.total_deliveries)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Pending Deliveries</p>
                  <p className="text-2xl font-bold text-orange-600">{formatNumber(delivery_stats.pending_deliveries)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Completed Deliveries</p>
                  <p className="text-2xl font-bold text-green-600">{formatNumber(delivery_stats.completed_deliveries)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Delivery Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(delivery_stats.total_delivery_revenue)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Delivery Completion Rate</span>
                  <span className="text-sm text-muted-foreground">{deliveryEfficiency.toFixed(1)}%</span>
                </div>
                <Progress value={deliveryEfficiency} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Distribution</CardTitle>
              <CardDescription>Preferred payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentMethodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#8884d8">
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
