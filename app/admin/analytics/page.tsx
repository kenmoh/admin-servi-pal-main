"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchApi, safeToFixed } from "@/lib/utils";
import {
  OrderTrendPoint,
  UserGrowthPoint,
  StatusBreakdownResponse,
  TopRider,
  TopVendor,
  TransactionAnalyticsResponse,
  AnalyticsInterval,
  VendorOrderType,
} from "@/types/analytics-types";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Star } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────
function fmt(n: any) {
  const num = Number(n);
  if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `₦${(num / 1_000).toFixed(1)}K`;
  return `₦${safeToFixed(num, 0)}`;
}

const INTERVAL_OPTIONS: { label: string; value: AnalyticsInterval }[] = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
];

const DAYS_OPTIONS = [
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
  { label: "90 days", value: "90" },
  { label: "All time", value: "0" },
];

const STATUS_COLORS = [
  "var(--color-a)",
  "var(--color-b)",
  "var(--color-c)",
  "var(--color-d)",
  "var(--color-e)",
  "var(--color-f)",
];

const PIE_COLORS = [
  "#f97316",
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#ef4444",
  "#eab308",
];

function SectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

// ── Order Trends Chart ────────────────────────────────────────
const orderTrendConfig: ChartConfig = {
  delivery_orders: { label: "Delivery", color: "#f97316" },
  food_orders: { label: "Food", color: "#3b82f6" },
  laundry_orders: { label: "Laundry", color: "#22c55e" },
  product_orders: { label: "Marketplace", color: "#a855f7" },
};

function OrderTrendsChart() {
  const [days, setDays] = useState("30");
  const [interval, setInterval] = useState<AnalyticsInterval>("day");

  const { data, isLoading } = useQuery<OrderTrendPoint[]>({
    queryKey: ["analytics-order-trends", days, interval],
    queryFn: () =>
      fetchApi(
        `/api/analytics?endpoint=order-trends&days=${days}&interval=${interval}`,
      ),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Order Trends</CardTitle>
          <CardDescription>Orders over time by service type</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={interval}
            onValueChange={(v) => setInterval(v as AnalyticsInterval)}
          >
            <SelectTrigger className="h-8 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTERVAL_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SectionSkeleton rows={6} />
        ) : (
          <ChartContainer config={orderTrendConfig} className="h-64 w-full">
            <AreaChart
              data={data}
              margin={{ top: 15, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.entries(orderTrendConfig).map(([key, cfg]) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={cfg.color}
                  fill={cfg.color}
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ── User Growth Chart ─────────────────────────────────────────
const userGrowthConfig: ChartConfig = {
  customers: { label: "Customers", color: "#f97316" },
  riders: { label: "Riders", color: "#3b82f6" },
  dispatchers: { label: "Dispatchers", color: "#22c55e" },
  restaurant_vendors: { label: "Restaurants", color: "#a855f7" },
  laundry_vendors: { label: "Laundry", color: "#eab308" },
};

function UserGrowthChart() {
  const [days, setDays] = useState("30");
  const [interval, setInterval] = useState<AnalyticsInterval>("day");

  const { data, isLoading } = useQuery<UserGrowthPoint[]>({
    queryKey: ["analytics-user-growth", days, interval],
    queryFn: () =>
      fetchApi(
        `/api/analytics?endpoint=user-growth&days=${days}&interval=${interval}`,
      ),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>New registrations by user type</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={interval}
            onValueChange={(v) => setInterval(v as AnalyticsInterval)}
          >
            <SelectTrigger className="h-8 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTERVAL_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SectionSkeleton rows={6} />
        ) : (
          <ChartContainer config={userGrowthConfig} className="h-64 w-full">
            <BarChart
              data={data}
              margin={{ top: 15, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.entries(userGrowthConfig).map(([key, cfg]) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={cfg.color}
                  radius={
                    key === "laundry_vendors" ? [4, 4, 0, 0] : [0, 0, 0, 0]
                  }
                />
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ── Status Breakdown ──────────────────────────────────────────
function StatusPie({
  title,
  data,
}: {
  title: string;
  data: { status: string; count: number; percentage: number }[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{title}</p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={60}
              label={({ status, percentage }) =>
                `${status} ${safeToFixed(percentage, 0)}%`
              }
              labelLine={false}
              fontSize={9}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v, n) => [v, n]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatusBreakdownSection() {
  const [days, setDays] = useState("30");

  const { data, isLoading } = useQuery<StatusBreakdownResponse>({
    queryKey: ["analytics-status", days],
    queryFn: () =>
      fetchApi(`/api/analytics?endpoint=status-breakdown&days=${days}`),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Status Breakdown</CardTitle>
          <CardDescription>
            Order status distribution by service
          </CardDescription>
        </div>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SectionSkeleton rows={4} />
        ) : (
          data && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatusPie title="Delivery" data={data.delivery} />
              <StatusPie title="Payment" data={data.delivery_payment} />
              <StatusPie title="Food" data={data.food} />
              <StatusPie title="Laundry" data={data.laundry} />
              <StatusPie title="Marketplace" data={data.product} />
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}

// ── Transaction Analytics ─────────────────────────────────────
const txTrendConfig: ChartConfig = {
  volume: { label: "Volume (₦)", color: "#f97316" },
  count: { label: "Count", color: "#3b82f6" },
};

function TransactionSection() {
  const [days, setDays] = useState("30");
  const [interval, setInterval] = useState<AnalyticsInterval>("day");

  const { data, isLoading } = useQuery<TransactionAnalyticsResponse>({
    queryKey: ["analytics-transactions", days, interval],
    queryFn: () =>
      fetchApi(
        `/api/analytics?endpoint=transactions&days=${days}&interval=${interval}`,
      ),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Transaction Analytics</CardTitle>
          <CardDescription>Volume and count over time</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={interval}
            onValueChange={(v) => setInterval(v as AnalyticsInterval)}
          >
            <SelectTrigger className="h-8 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTERVAL_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <SectionSkeleton rows={6} />
        ) : (
          data && (
            <>
              <ChartContainer
                config={txTrendConfig}
                className="h-[640px] w-full text-xs aspect-auto"
              >
                <AreaChart
                  data={data.trend}
                  margin={{ top: 35, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => fmt(v)}
                    width={60}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="volume"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">By Type</p>
                  <div className="space-y-1">
                    {data.by_type.map((t) => (
                      <div
                        key={t.type}
                        className="flex justify-between text-xs"
                      >
                        <span className="text-muted-foreground">{t.type}</span>
                        <span className="font-mono">
                          {fmt(t.volume)} ({t.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">By Order Type</p>
                  <div className="space-y-1">
                    {data.by_order_type.map((t) => (
                      <div
                        key={t.order_type}
                        className="flex justify-between text-xs"
                      >
                        <span className="text-muted-foreground">
                          {t.order_type}
                        </span>
                        <span className="font-mono">
                          {fmt(t.volume)} ({t.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}

// ── Top Riders ────────────────────────────────────────────────
function TopRidersSection() {
  const [days, setDays] = useState("30");

  const { data, isLoading } = useQuery<TopRider[]>({
    queryKey: ["analytics-top-riders", days],
    queryFn: () =>
      fetchApi(`/api/analytics?endpoint=top-riders&days=${days}&limit=10`),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Top Riders</CardTitle>
          <CardDescription>Sorted by completed deliveries</CardDescription>
        </div>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SectionSkeleton rows={5} />
        ) : (
          <div className="space-y-3">
            {data?.map((rider, i) => (
              <div key={rider.id} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4">
                  {i + 1}
                </span>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={rider.profile_image_url ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {rider.full_name?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {rider.full_name ?? "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {rider.bike_number ?? "—"} ·{" "}
                    {rider.dispatcher_business_name ?? "Independent"}
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-0.5">
                  <p className="text-sm font-semibold text-orange-500">
                    {rider.completed_deliveries} done
                  </p>
                  <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {safeToFixed(rider.average_rating, 1)}
                    <span>· {safeToFixed(rider.cancel_rate, 0)}% cancel</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Top Vendors ───────────────────────────────────────────────
function TopVendorsSection() {
  const [days, setDays] = useState("30");
  const [orderType, setOrderType] = useState<VendorOrderType>("FOOD");

  const { data, isLoading } = useQuery<TopVendor[]>({
    queryKey: ["analytics-top-vendors", days, orderType],
    queryFn: () =>
      fetchApi(
        `/api/analytics?endpoint=top-vendors&days=${days}&limit=10&order_type=${orderType}`,
      ),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Top Vendors</CardTitle>
          <CardDescription>Sorted by completed orders</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select
            value={orderType}
            onValueChange={(v) => setOrderType(v as VendorOrderType)}
          >
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FOOD">Food</SelectItem>
              <SelectItem value="LAUNDRY">Laundry</SelectItem>
              <SelectItem value="PRODUCT">Marketplace</SelectItem>
            </SelectContent>
          </Select>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SectionSkeleton rows={5} />
        ) : (
          <div className="space-y-3">
            {data?.map((vendor, i) => (
              <div key={vendor.id} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4">
                  {i + 1}
                </span>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={vendor.profile_image_url ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {vendor.name?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {vendor.name ?? "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {vendor.total_orders} total · {vendor.cancelled_orders}{" "}
                    cancelled
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-0.5">
                  <p className="text-sm font-semibold text-orange-500">
                    {vendor.completed_orders} done
                  </p>
                  <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {safeToFixed(vendor.average_rating, 1)}
                    <span>· {fmt(vendor.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function AnalyticsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Analytics" />
        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderTrendsChart />
            <UserGrowthChart />
          </div>
          <StatusBreakdownSection />
          <TransactionSection />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopRidersSection />
            <TopVendorsSection />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
