"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "@/util/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type {
  GrowthMetricsResponse,
  GrowthTrendPoint,
  GrowthSummaryResponse,
} from "@/types/analytics-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchGrowth<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const token = await getAccessToken();
  if (!token) throw new Error("No token");
  const sp = new URLSearchParams({ endpoint, ...params });
  const res = await fetch(`${API_URL}/api/analytics?${sp}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

function GrowthIndicator({ value, invert = false }: { value: number; invert?: boolean }) {
  const isPositive = invert ? value < 0 : value > 0;
  const isNegative = invert ? value > 0 : value < 0;
  const isZero = value === 0;

  return (
    <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${
      isPositive ? "text-emerald-600" : isNegative ? "text-red-600" : "text-muted-foreground"
    }`}>
      {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> :
       isNegative ? <ArrowDownRight className="h-3.5 w-3.5" /> :
       <Minus className="h-3.5 w-3.5" />}
      {isZero ? "0" : `${Math.abs(value)}%`}
    </span>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

const userChartConfig = {
  users: { label: "New Users", color: "var(--primary)" },
} satisfies ChartConfig;

const orderChartConfig = {
  total_orders: { label: "Total Orders", color: "var(--primary)" },
  food_orders: { label: "Food", color: "hsl(25, 95%, 53%)" },
  delivery_orders: { label: "Delivery", color: "hsl(142, 71%, 45%)" },
  laundry_orders: { label: "Laundry", color: "hsl(262, 83%, 58%)" },
  product_orders: { label: "Marketplace", color: "hsl(199, 89%, 48%)" },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "var(--primary)" },
} satisfies ChartConfig;

export default function GrowthPage() {
  const [days, setDays] = useState(30);
  const [interval, setInterval] = useState<"day" | "week" | "month">("day");

  const { data: metrics, isLoading: metricsLoading } = useQuery<GrowthMetricsResponse>({
    queryKey: ["growth-metrics"],
    queryFn: () => fetchGrowth("growth/metrics"),
    refetchInterval: 300_000,
  });

  const { data: trends, isLoading: trendsLoading } = useQuery<GrowthTrendPoint[]>({
    queryKey: ["growth-trends", days, interval],
    queryFn: () => fetchGrowth("growth/trends", { days: String(days), interval }),
    refetchInterval: 300_000,
  });

  const { data: summary, isLoading: summaryLoading } = useQuery<GrowthSummaryResponse>({
    queryKey: ["growth-summary"],
    queryFn: () => fetchGrowth("growth/summary"),
    refetchInterval: 120_000,
  });

  const isLoading = metricsLoading || trendsLoading || summaryLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading growth analytics...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Period Toggle */}
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-lg font-semibold">Growth Analytics</h2>
        <Tabs value={interval} onValueChange={(v) => setInterval(v as typeof interval)}>
          <TabsList>
            <TabsTrigger value="day">Daily</TabsTrigger>
            <TabsTrigger value="week">Weekly</TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Quick Stats — Today */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary?.today.users ?? 0)}</div>
            <GrowthIndicator value={summary?.today.user_growth_pct ?? 0} />
            <p className="text-xs text-muted-foreground mt-1">
              vs {summary?.today.yesterday_users ?? 0} yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary?.today.orders ?? 0)}</div>
            <GrowthIndicator value={summary?.today.order_growth_pct ?? 0} />
            <p className="text-xs text-muted-foreground mt-1">
              vs {summary?.today.yesterday_orders ?? 0} yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.today.revenue ?? 0)}</div>
            <GrowthIndicator value={summary?.today.revenue_growth_pct ?? 0} />
            <p className="text-xs text-muted-foreground mt-1">
              vs {formatCurrency(summary?.today.yesterday_revenue ?? 0)} yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats — This Week */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Users This Week</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary?.this_week.users ?? 0)}</div>
            <GrowthIndicator value={summary?.this_week.user_growth_pct ?? 0} />
            <p className="text-xs text-muted-foreground mt-1">
              vs {summary?.this_week.last_week_users ?? 0} last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders This Week</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary?.this_week.orders ?? 0)}</div>
            <GrowthIndicator value={summary?.this_week.order_growth_pct ?? 0} />
            <p className="text-xs text-muted-foreground mt-1">
              vs {summary?.this_week.last_week_orders ?? 0} last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Week</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.this_week.revenue ?? 0)}</div>
            <GrowthIndicator value={summary?.this_week.revenue_growth_pct ?? 0} />
            <p className="text-xs text-muted-foreground mt-1">
              vs {formatCurrency(summary?.this_week.last_week_revenue ?? 0)} last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* WoW & MoM Growth Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Week-over-Week Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Users</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatNumber(metrics?.weekly.users.current ?? 0)}</span>
                <GrowthIndicator value={metrics?.weekly.users.growth_pct ?? 0} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Orders</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatNumber(metrics?.weekly.orders.current ?? 0)}</span>
                <GrowthIndicator value={metrics?.weekly.orders.growth_pct ?? 0} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatCurrency(metrics?.weekly.revenue.current ?? 0)}</span>
                <GrowthIndicator value={metrics?.weekly.revenue.growth_pct ?? 0} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Month-over-Month Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Users</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatNumber(metrics?.monthly.users.current ?? 0)}</span>
                <GrowthIndicator value={metrics?.monthly.users.growth_pct ?? 0} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Orders</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatNumber(metrics?.monthly.orders.current ?? 0)}</span>
                <GrowthIndicator value={metrics?.monthly.orders.growth_pct ?? 0} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatCurrency(metrics?.monthly.revenue.current ?? 0)}</span>
                <GrowthIndicator value={metrics?.monthly.revenue.growth_pct ?? 0} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All-Time Totals */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics?.all_time.total_users ?? 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics?.all_time.total_orders ?? 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics?.all_time.total_revenue ?? 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={userChartConfig} className="h-[250px] w-full">
              <AreaChart data={trends ?? []}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="period_start"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return interval === "month"
                      ? d.toLocaleDateString("en-US", { month: "short" })
                      : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
                />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => String(v)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="new_users" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Order Growth by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={orderChartConfig} className="h-[250px] w-full">
              <AreaChart data={trends ?? []}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="period_start"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return interval === "month"
                      ? d.toLocaleDateString("en-US", { month: "short" })
                      : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }}
                />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="food_orders" stackId="1" stroke="hsl(25, 95%, 53%)" fill="hsl(25, 95%, 53%)" fillOpacity={0.4} />
                <Area type="monotone" dataKey="delivery_orders" stackId="1" stroke="hsl(142, 71%, 45%)" fill="hsl(142, 71%, 45%)" fillOpacity={0.4} />
                <Area type="monotone" dataKey="laundry_orders" stackId="1" stroke="hsl(262, 83%, 58%)" fill="hsl(262, 83%, 58%)" fillOpacity={0.4} />
                <Area type="monotone" dataKey="product_orders" stackId="1" stroke="hsl(199, 89%, 48%)" fill="hsl(199, 89%, 48%)" fillOpacity={0.4} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
            <BarChart data={trends ?? []}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period_start"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return interval === "month"
                    ? d.toLocaleDateString("en-US", { month: "short" })
                    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }}
              />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
