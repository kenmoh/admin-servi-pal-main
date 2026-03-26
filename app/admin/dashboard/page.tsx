'use client'

import React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { DashboardOverviewResponse } from '@/types/analytics-types'
import { fetchApi, safeToFixed } from '@/lib/utils'
import {
  Users, ShoppingBag, TrendingUp, Wallet,
  ArrowUpRight, Star, Bike, UtensilsCrossed,
  WashingMachine, Store, AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function fmt(n: any) {
  const num = Number(n);
  if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `₦${(num / 1_000).toFixed(1)}K`
  return `₦${safeToFixed(num, 2)}`
}

function num(n: number) {
  return n?.toLocaleString() ?? '—'
}

function KpiCard({ title, value, sub, icon: Icon, iconClass }: {
  title: string
  value: string | number
  sub?: string
  icon: React.ElementType
  iconClass?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn('p-2 rounded-md', iconClass ?? 'bg-orange-500/10')}>
          <Icon className={cn('w-4 h-4', iconClass ? 'text-white' : 'text-orange-500')} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function KpiSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
      <CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-3 w-20 mt-2" /></CardContent>
    </Card>
  )
}

function StatRow({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b last:border-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-medium', highlight && 'text-orange-500')}>{value}</span>
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardOverviewResponse>({
    queryKey: ['analytics-overview'],
    queryFn: () => fetchApi('/api/analytics?endpoint=overview'),
    staleTime: 60_000,
  })

  return (
    <SidebarProvider style={{ '--sidebar-width': 'calc(var(--spacing) * 72)', '--header-height': 'calc(var(--spacing) * 12)' } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Dashboard" />

        <div className="px-6 py-6 space-y-6">

          {/* Top KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading ? Array.from({ length: 8 }).map((_, i) => <KpiSkeleton key={i} />) : data && (<>
              <KpiCard title="Total Users" value={num(data.users.total)} sub={`+${num(data.users.new_30d)} this month`} icon={Users} />
              <KpiCard title="Total Orders" value={num(data.orders.totals.all_orders)} sub={`+${num(data.orders.totals.orders_30d)} this month`} icon={ShoppingBag} />
              <KpiCard title="Total Revenue" value={fmt(data.revenue.total)} sub={`${fmt(data.revenue.revenue_30d)} this month`} icon={TrendingUp} />
              <KpiCard title="Wallet Balance" value={fmt(data.wallets.total_balance)} sub={`${fmt(data.wallets.total_escrow)} in escrow`} icon={Wallet} />
              <KpiCard title="Tx Volume (30d)" value={fmt(data.transactions.volume_30d)} sub={`${num(data.transactions.count_30d)} transactions`} icon={ArrowUpRight} />
              <KpiCard title="Avg Rating" value={safeToFixed(data.reviews.avg_rating, 2)} sub={`${num(data.reviews.total)} reviews · ${safeToFixed(data.reviews.five_star_pct, 0)}% five-star`} icon={Star} />
              <KpiCard title="Active Users" value={num(data.users.active)} sub={`${num(data.users.blocked)} blocked`} icon={Users} />
              <KpiCard title="Disputed Orders" value={num(data.orders.totals.all_disputed)} sub={`${num(data.orders.totals.all_cancelled)} cancelled`} icon={AlertTriangle} iconClass="bg-red-500/10" />
            </>)}
          </div>

          {/* Orders breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardContent className="pt-4 space-y-2">{Array.from({ length: 5 }).map((_, j) => <Skeleton key={j} className="h-4 w-full" />)}</CardContent></Card>) : data && (
              <>
                {[
                  { label: 'Delivery', icon: Bike, stats: data.orders.delivery, revenue: data.revenue.delivery },
                  { label: 'Food', icon: UtensilsCrossed, stats: data.orders.food, revenue: data.revenue.food },
                  { label: 'Laundry', icon: WashingMachine, stats: data.orders.laundry, revenue: data.revenue.laundry },
                  { label: 'Marketplace', icon: Store, stats: data.orders.product, revenue: data.revenue.product },
                ].map(({ label, icon: Icon, stats, revenue }) => (
                  <Card key={label}>
                    <CardHeader className="pb-2 flex flex-row items-center gap-2">
                      <Icon className="w-4 h-4 text-orange-500" />
                      <CardTitle className="text-sm font-semibold">{label}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-0">
                      <StatRow label="Total" value={num(stats.total)} />
                      <StatRow label="Completed" value={num(stats.completed)} highlight />
                      <StatRow label="Cancelled" value={num(stats.cancelled)} />
                      <StatRow label="Disputed" value={num(stats.disputed)} />
                      <StatRow label="Last 30d" value={num(stats.orders_30d)} />
                      <StatRow label="Completion" value={`${safeToFixed(stats.completion_rate, 1)}%`} />
                      <StatRow label="Revenue" value={fmt(revenue)} highlight />
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>

          {/* Users breakdown */}
          {isLoading ? <Skeleton className="h-40 w-full" /> : data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-sm font-semibold">User Breakdown</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                  <StatRow label="Customers" value={num(data.users.customers)} />
                  <StatRow label="Riders" value={num(data.users.riders)} />
                  <StatRow label="Dispatchers" value={num(data.users.dispatchers)} />
                  <StatRow label="Restaurant Vendors" value={num(data.users.restaurant_vendors)} />
                  <StatRow label="Laundry Vendors" value={num(data.users.laundry_vendors)} />
                  <StatRow label="New (7d)" value={num(data.users.new_7d)} highlight />
                  <StatRow label="New (30d)" value={num(data.users.new_30d)} highlight />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm font-semibold">Transaction Overview</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                  <StatRow label="Total Volume" value={fmt(data.transactions.total_volume)} highlight />
                  <StatRow label="Volume (7d)" value={fmt(data.transactions.volume_7d)} />
                  <StatRow label="Volume (30d)" value={fmt(data.transactions.volume_30d)} />
                  <StatRow label="Total Count" value={num(data.transactions.total_count)} />
                  <StatRow label="Count (30d)" value={num(data.transactions.count_30d)} />
                  <StatRow label="Total Wallets" value={num(data.wallets.total_wallets)} />
                  <StatRow label="Escrow Balance" value={fmt(data.wallets.total_escrow)} />
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
