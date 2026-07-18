'use client'

import React, { useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchApi, safeToFixed } from '@/lib/utils'
import {
  Activity, AlertTriangle, CheckCircle, XCircle,
  RefreshCw, Wifi, WifiOff, Clock, Zap, Shield,
  BarChart3, TrendingUp, TrendingDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────
interface PaymentAlert {
  type: string
  severity: string
  message: string
  details?: Record<string, unknown>
}

interface PaymentHealth {
  status: string
  alerts: PaymentAlert[]
  checked_at: string
}

interface PaymentMetrics {
  hourly: {
    total: number
    completed: number
    failed: number
    success_rate: number
  }
  daily: {
    total: number
    completed: number
    success_rate: number
  }
  circuit_breakers: {
    api_breaker: CircuitBreakerStats
    transfer_breaker: CircuitBreakerStats
  }
  timestamp: string
}

interface CircuitBreakerStats {
  service: string
  state: string
  failures: number
  failure_threshold: number
  recovery_timeout: number
}

interface ReconciliationSummary {
  pending_count: number
  completed_count: number
  failed_jobs_count: number
  timestamp: string
}

interface StuckPayment {
  tx_ref: string
  payment_type: string
  amount: number
  status: string
  created_at: string
}

interface FailedJob {
  id: string
  tx_ref: string
  payment_type: string
  error_message: string
  status: string
  created_at: string
  retry_count: number
}

// ───────────────────────────────────────────────
// Helper Components
// ───────────────────────────────────────────────
function KpiCard({ title, value, sub, icon: Icon, variant = 'default' }: {
  title: string
  value: string | number
  sub?: string
  icon: React.ElementType
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const iconColors = {
    default: 'bg-orange-500/10 text-orange-500',
    success: 'bg-green-500/10 text-green-500',
    warning: 'bg-amber-500/10 text-amber-500',
    danger: 'bg-red-500/10 text-red-500',
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn('p-2 rounded-md', iconColors[variant])}>
          <Icon className="w-4 h-4" />
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

function CircuitBreakerCard({ breaker }: { breaker: CircuitBreakerStats }) {
  const isHealthy = breaker.state === 'CLOSED'
  const isOpen = breaker.state === 'OPEN'

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium capitalize">
          {breaker.service.replace('_', ' ')}
        </CardTitle>
        <Badge variant={isHealthy ? 'default' : isOpen ? 'destructive' : 'secondary'}>
          {breaker.state}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Failures</span>
          <span className={cn('font-medium', isOpen ? 'text-red-500' : '')}>
            {breaker.failures} / {breaker.failure_threshold}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Recovery Timeout</span>
          <span>{breaker.recovery_timeout}s</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 mt-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all',
              isOpen ? 'bg-red-500' : breaker.failures > 0 ? 'bg-amber-500' : 'bg-green-500'
            )}
            style={{ width: `${Math.min((breaker.failures / breaker.failure_threshold) * 100, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function AlertCard({ alert }: { alert: PaymentAlert }) {
  const severityColors: Record<string, string> = {
    CRITICAL: 'border-red-500 bg-red-500/5',
    HIGH: 'border-orange-500 bg-orange-500/5',
    MEDIUM: 'border-amber-500 bg-amber-500/5',
    LOW: 'border-blue-500 bg-blue-500/5',
  }

  const severityIcons: Record<string, React.ElementType> = {
    CRITICAL: XCircle,
    HIGH: AlertTriangle,
    MEDIUM: Clock,
    LOW: Activity,
  }

  const Icon = severityIcons[alert.severity] || AlertTriangle

  return (
    <div className={cn('border-l-4 p-4 rounded-r-lg', severityColors[alert.severity] || severityColors.MEDIUM)}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">{alert.severity}</Badge>
            <span className="text-xs text-muted-foreground">{alert.type}</span>
          </div>
          <p className="text-sm">{alert.message}</p>
        </div>
      </div>
    </div>
  )
}

function StuckPaymentRow({ payment }: { payment: StuckPayment }) {
  return (
    <tr className="border-b last:border-0">
      <td className="py-2 px-3 font-mono text-xs">{payment.tx_ref}</td>
      <td className="py-2 px-3 text-sm">{payment.payment_type}</td>
      <td className="py-2 px-3 text-sm font-medium">₦{payment.amount?.toLocaleString()}</td>
      <td className="py-2 px-3">
        <Badge variant="secondary">{payment.status}</Badge>
      </td>
      <td className="py-2 px-3 text-xs text-muted-foreground">
        {new Date(payment.created_at).toLocaleString()}
      </td>
    </tr>
  )
}

// ───────────────────────────────────────────────
// Main Page
// ───────────────────────────────────────────────
export default function PaymentHealthPage() {
  const queryClient = useQueryClient()
  const [showStuck, setShowStuck] = useState(false)

  // Fetch payment health
  const { data: health, isLoading: healthLoading } = useQuery<PaymentHealth>({
    queryKey: ['payment-health'],
    queryFn: () => fetchApi('/api/payments?endpoint=health'),
    refetchInterval: 30_000, // Auto-refresh every 30s
  })

  // Fetch metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery<PaymentMetrics>({
    queryKey: ['payment-metrics'],
    queryFn: () => fetchApi('/api/payments?endpoint=metrics'),
    refetchInterval: 30_000,
  })

  // Fetch reconciliation
  const { data: reconciliation, isLoading: reconLoading } = useQuery<ReconciliationSummary>({
    queryKey: ['payment-reconciliation'],
    queryFn: () => fetchApi('/api/payments?endpoint=reconciliation'),
    refetchInterval: 60_000,
  })

  // Fetch stuck payments
  const { data: stuckData } = useQuery<{ count: number; payments: StuckPayment[] }>({
    queryKey: ['payment-stuck'],
    queryFn: () => fetchApi('/api/payments?endpoint=reconciliation/stuck&minutes=60'),
    enabled: showStuck,
  })

  // Reset circuit breaker mutation
  const resetMutation = useMutation({
    mutationFn: async (service: string) => {
      const res = await fetch(`/api/payments?endpoint=circuit-breakers/${service}/reset`, {
        method: 'POST',
      })
      return res.json()
    },
    onSuccess: () => {
      toast.success('Circuit breaker reset successfully')
      queryClient.invalidateQueries({ queryKey: ['payment-metrics'] })
    },
    onError: () => {
      toast.error('Failed to circuit breaker')
    },
  })

  const isHealthy = health?.status === 'HEALTHY'
  const hourlyRate = metrics?.hourly?.success_rate ?? 100
  const dailyRate = metrics?.daily?.success_rate ?? 100

  return (
    <SidebarProvider style={{ '--sidebar-width': 'calc(var(--spacing) * 72)', '--header-height': 'calc(var(--spacing) * 12)' } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Payment Health" />

        <div className="px-6 py-6 space-y-6">

          {/* Status Banner */}
          <Card className={cn(
            'border-2',
            isHealthy ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'
          )}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isHealthy ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  )}
                  <div>
                    <p className="font-semibold">
                      Payment System {isHealthy ? 'Operational' : 'Issues Detected'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {health?.alerts?.length ?? 0} active alerts
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ['payment-health'] })
                    queryClient.invalidateQueries({ queryKey: ['payment-metrics'] })
                    queryClient.invalidateQueries({ queryKey: ['payment-reconciliation'] })
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricsLoading ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />) : (
              <>
                <KpiCard
                  title="Hourly Success Rate"
                  value={`${safeToFixed(hourlyRate, 1)}%`}
                  sub={`${metrics?.hourly?.completed ?? 0} / ${metrics?.hourly?.total ?? 0} completed`}
                  icon={TrendingUp}
                  variant={hourlyRate >= 95 ? 'success' : hourlyRate >= 80 ? 'warning' : 'danger'}
                />
                <KpiCard
                  title="Daily Success Rate"
                  value={`${safeToFixed(dailyRate, 1)}%`}
                  sub={`${metrics?.daily?.completed ?? 0} / ${metrics?.daily?.total ?? 0} completed`}
                  icon={BarChart3}
                  variant={dailyRate >= 95 ? 'success' : dailyRate >= 80 ? 'warning' : 'danger'}
                />
                <KpiCard
                  title="Pending (Stuck)"
                  value={reconciliation?.pending_count ?? 0}
                  sub="Payments awaiting processing"
                  icon={Clock}
                  variant={(reconciliation?.pending_count ?? 0) > 0 ? 'warning' : 'success'}
                />
                <KpiCard
                  title="Failed Jobs"
                  value={reconciliation?.failed_jobs_count ?? 0}
                  sub="Dead letter queue"
                  icon={XCircle}
                  variant={(reconciliation?.failed_jobs_count ?? 0) > 0 ? 'danger' : 'success'}
                />
              </>
            )}
          </div>

          {/* Alerts Section */}
          {health && health.alerts && health.alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Active Alerts ({health.alerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {health.alerts.map((alert, i) => (
                  <AlertCard key={i} alert={alert} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Circuit Breakers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-orange-500" />
                  Circuit Breakers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics?.circuit_breakers?.api_breaker && (
                  <div className="space-y-2">
                    <CircuitBreakerCard breaker={metrics.circuit_breakers.api_breaker} />
                    {metrics.circuit_breakers.api_breaker.state !== 'CLOSED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => resetMutation.mutate('api')}
                        disabled={resetMutation.isPending}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset API Breaker
                      </Button>
                    )}
                  </div>
                )}
                {metrics?.circuit_breakers?.transfer_breaker && (
                  <div className="space-y-2">
                    <CircuitBreakerCard breaker={metrics.circuit_breakers.transfer_breaker} />
                    {metrics.circuit_breakers.transfer_breaker.state !== 'CLOSED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => resetMutation.mutate('transfer')}
                        disabled={resetMutation.isPending}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset Transfer Breaker
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reconciliation Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  Reconciliation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Completed (24h)</span>
                  <span className="font-bold text-green-600">{reconciliation?.completed_count ?? 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className={cn('font-bold', (reconciliation?.pending_count ?? 0) > 0 ? 'text-amber-600' : 'text-green-600')}>
                    {reconciliation?.pending_count ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Failed Jobs</span>
                  <span className={cn('font-bold', (reconciliation?.failed_jobs_count ?? 0) > 0 ? 'text-red-600' : 'text-green-600')}>
                    {reconciliation?.failed_jobs_count ?? 0}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setShowStuck(!showStuck)}
                >
                  {showStuck ? 'Hide' : 'View'} Stuck Payments
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stuck Payments Table */}
          {showStuck && stuckData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Stuck Payments ({stuckData.count})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stuckData.payments.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No stuck payments found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-xs text-muted-foreground">
                          <th className="py-2 px-3">TX Ref</th>
                          <th className="py-2 px-3">Type</th>
                          <th className="py-2 px-3">Amount</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stuckData.payments.map((payment) => (
                          <StuckPaymentRow key={payment.tx_ref} payment={payment} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
