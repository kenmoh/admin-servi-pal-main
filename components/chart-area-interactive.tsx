"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { OrderStatsResponse, StatsPeriod } from "@/types/stats-types"
import { getOrderStats } from "@/actions/stats"

export const description = "An interactive area chart for order statistics"

const chartConfig = {
  orders: {
    label: "Orders",
  },
  package: {
    label: "Package",
    color: "var(--primary)",
  },
  food: {
    label: "Food",
    color: "var(--primary)",
  },
  laundry: {
    label: "Laundry",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  orderStats?: OrderStatsResponse | null;
}

export function ChartAreaInteractive({ orderStats }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<StatsPeriod>(StatsPeriod.LAST_7_DAYS)
  const [data, setData] = React.useState<OrderStatsResponse | null>(orderStats || null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange(StatsPeriod.LAST_7_DAYS)
    }
  }, [isMobile])

  React.useEffect(() => {
    if (orderStats) {
      setData(orderStats)
    }
  }, [orderStats])

  const handleTimeRangeChange = React.useCallback(async (newTimeRange: StatsPeriod) => {
    setTimeRange(newTimeRange)
    setLoading(true)
    
    try {
      const result = await getOrderStats(newTimeRange)
      if ("error" in result) {
        console.error("Error fetching order stats:", result.error)
      } else {
        setData(result)
      }
    } catch (error) {
      console.error("Error fetching order stats:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Transform data for chart
  const chartData = data?.data || []
  const totalOrders = data?.summary.total_orders || 0

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Order Statistics</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Daily orders by type - {totalOrders.toLocaleString()} total orders
          </span>
          <span className="@[540px]/card:hidden">{totalOrders.toLocaleString()} total orders</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={handleTimeRangeChange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            disabled={loading}
          >
            <ToggleGroupItem value={StatsPeriod.LAST_3_MONTHS}>Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value={StatsPeriod.LAST_30_DAYS}>Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value={StatsPeriod.LAST_7_DAYS}>Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={handleTimeRangeChange} disabled={loading}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value={StatsPeriod.LAST_3_MONTHS} className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value={StatsPeriod.LAST_30_DAYS} className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value={StatsPeriod.LAST_7_DAYS} className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading && (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        )}
        {!loading && chartData.length > 0 && (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillPackage" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-package)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-package)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillFood" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-food)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-food)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillLaundry" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-laundry)"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-laundry)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : Math.floor(chartData.length / 2)}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="package"
                type="natural"
                fill="url(#fillPackage)"
                stroke="var(--color-package)"
                stackId="a"
              />
              <Area
                dataKey="food"
                type="natural"
                fill="url(#fillFood)"
                stroke="var(--color-food)"
                stackId="a"
              />
              <Area
                dataKey="laundry"
                type="natural"
                fill="url(#fillLaundry)"
                stroke="var(--color-laundry)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
        {!loading && chartData.length === 0 && (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">No order data available</p>
              <p className="text-xs mt-1">Try selecting a different time period</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}