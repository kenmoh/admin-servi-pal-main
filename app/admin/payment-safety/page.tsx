'use client'

import React, { useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchApi } from '@/lib/utils'
import {
  Receipt, Search, AlertTriangle, Shield, RotateCcw,
  CheckCircle, XCircle, Clock, Eye, Ban, FileText,
  RefreshCw, User, DollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────
interface Receipt {
  id: string
  tx_ref: string
  receipt_number: string
  payment_type: string
  amount: number
  payment_method: string
  customer_id: string
  customer_name: string
  issued_at: string
}

interface DuplicateAlert {
  id: string
  user_id: string
  amount: number
  first_tx_ref: string
  second_tx_ref: string
  time_window_minutes: number
  status: string
  created_at: string
}

interface SuspiciousPattern {
  id: string
  user_id: string
  pattern_type: string
  description: string
  risk_score: number
  status: string
  detected_at: string
}

interface Reversal {
  id: string
  original_tx_ref: string
  reversal_tx_ref: string
  amount: number
  reason: string
  reversal_type: string
  status: string
  created_at: string
}

interface WebhookLog {
  id: string
  webhook_type: string
  source: string
  signature_valid: boolean
  event_type: string
  tx_ref: string
  processed: boolean
  skip_reason: string
  created_at: string
}

// ───────────────────────────────────────────────
// Tab: Receipts
// ───────────────────────────────────────────────
function ReceiptsTab() {
  const [searchTxRef, setSearchTxRef] = useState('')

  const { data: receiptData, isLoading, refetch } = useQuery({
    queryKey: ['receipt', searchTxRef],
    queryFn: () => fetchApi(`/api/payments?endpoint=verify/${searchTxRef}`),
    enabled: !!searchTxRef,
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Enter tx_ref to verify..."
            className="pl-10"
            value={searchTxRef}
            onChange={(e) => setSearchTxRef(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && refetch()}
          />
        </div>
        <Button onClick={() => refetch()} disabled={!searchTxRef}>
          <Search className="w-4 h-4 mr-2" />
          Verify
        </Button>
      </div>

      {receiptData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-500" />
              Charge Verification Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">TX Ref</span>
              <span className="font-mono text-sm">{receiptData.tx_ref}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={receiptData.status === 'COMPLETED' ? 'default' : 'secondary'}>
                {receiptData.status}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-bold text-green-600">₦{receiptData.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Payment Type</span>
              <span className="text-sm">{receiptData.payment_type}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">FLW Ref</span>
              <span className="font-mono text-xs">{receiptData.flw_ref || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">{new Date(receiptData.created_at).toLocaleString()}</span>
            </div>
            {receiptData.receipt && (
              <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                <p className="text-sm font-medium text-green-600">Receipt: {receiptData.receipt.receipt_number}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!searchTxRef && (
        <Card className="p-12 text-center">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-muted-foreground">Enter a TX Ref to verify a charge</p>
        </Card>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────
// Tab: Duplicates
// ───────────────────────────────────────────────
function DuplicatesTab() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<{ count: number; alerts: DuplicateAlert[] }>({
    queryKey: ['duplicates'],
    queryFn: () => fetchApi('/api/payments?endpoint=duplicates'),
  })

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/payments?endpoint=duplicates/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      return res.json()
    },
    onSuccess: () => {
      toast.success('Alert reviewed')
      queryClient.invalidateQueries({ queryKey: ['duplicates'] })
    },
  })

  const alerts = data?.alerts ?? []

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500/40" />
          <p className="text-muted-foreground">No duplicate charge alerts</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">Duplicate Charge Detected</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ₦{alert.amount?.toLocaleString()} charged twice within {alert.time_window_minutes} minutes
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>First: {alert.first_tx_ref}</span>
                      <span>Second: {alert.second_tx_ref}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {alert.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reviewMutation.mutate({ id: alert.id, status: 'FALSE_POSITIVE' })}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          False Positive
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => reviewMutation.mutate({ id: alert.id, status: 'REFUNDED' })}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Refund
                        </Button>
                      </>
                    )}
                    <Badge variant={alert.status === 'PENDING' ? 'destructive' : 'default'}>
                      {alert.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────
// Tab: Suspicious Patterns
// ───────────────────────────────────────────────
function SuspiciousTab() {
  const { data, isLoading } = useQuery<{ count: number; patterns: SuspiciousPattern[] }>({
    queryKey: ['suspicious'],
    queryFn: () => fetchApi('/api/payments?endpoint=suspicious'),
  })

  const patterns = data?.patterns ?? []

  const patternIcons: Record<string, React.ElementType> = {
    HIGH_FREQUENCY: Clock,
    ROUND_AMOUNT_REPEAT: DollarSign,
    CARD_TESTING: AlertTriangle,
    MULTI_PAYMENT_METHOD: Shield,
  }

  const riskColors = (score: number) => {
    if (score >= 80) return 'text-red-500 bg-red-500/10'
    if (score >= 50) return 'text-orange-500 bg-orange-500/10'
    return 'text-amber-500 bg-amber-500/10'
  }

  return (
    <div className="space-y-4">
      {patterns.length === 0 ? (
        <Card className="p-12 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-green-500/40" />
          <p className="text-muted-foreground">No suspicious patterns detected</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {patterns.map((pattern) => {
            const Icon = patternIcons[pattern.pattern_type] || AlertTriangle
            return (
              <Card key={pattern.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{pattern.pattern_type.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{pattern.description}</p>
                      <p className="text-xs text-muted-foreground">
                        User: {pattern.user_id} • {new Date(pattern.detected_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-bold px-2 py-1 rounded', riskColors(pattern.risk_score))}>
                        Risk: {pattern.risk_score}
                      </span>
                      <Badge variant={pattern.status === 'PENDING' ? 'destructive' : 'default'}>
                        {pattern.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────
// Tab: Reversals
// ───────────────────────────────────────────────
function ReversalsTab() {
  const { data, isLoading } = useQuery<{ count: number; reversals: Reversal[] }>({
    queryKey: ['reversals'],
    queryFn: () => fetchApi('/api/payments?endpoint=reversals'),
  })

  const reversals = data?.reversals ?? []

  return (
    <div className="space-y-4">
      {reversals.length === 0 ? (
        <Card className="p-12 text-center">
          <RotateCcw className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-muted-foreground">No charge reversals</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 px-3">Original TX Ref</th>
                <th className="py-2 px-3">Reversal TX Ref</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Reason</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {reversals.map((rev) => (
                <tr key={rev.id} className="border-b last:border-0">
                  <td className="py-2 px-3 font-mono text-xs">{rev.original_tx_ref}</td>
                  <td className="py-2 px-3 font-mono text-xs">{rev.reversal_tx_ref}</td>
                  <td className="py-2 px-3 font-medium">₦{rev.amount?.toLocaleString()}</td>
                  <td className="py-2 px-3 text-sm">{rev.reason}</td>
                  <td className="py-2 px-3">
                    <Badge variant={rev.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {rev.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────
// Tab: Webhook Audit
// ───────────────────────────────────────────────
function WebhookAuditTab() {
  const { data, isLoading } = useQuery<{ count: number; logs: WebhookLog[] }>({
    queryKey: ['webhook-audit'],
    queryFn: () => fetchApi('/api/payments?endpoint=webhook-audit'),
  })

  const logs = data?.logs ?? []

  return (
    <div className="space-y-4">
      {logs.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="text-muted-foreground">No webhook logs yet</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 px-3">Source</th>
                <th className="py-2 px-3">Signature</th>
                <th className="py-2 px-3">Event</th>
                <th className="py-2 px-3">TX Ref</th>
                <th className="py-2 px-3">Processed</th>
                <th className="py-2 px-3">Skip Reason</th>
                <th className="py-2 px-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b last:border-0">
                  <td className="py-2 px-3 text-sm">{log.source}</td>
                  <td className="py-2 px-3">
                    {log.signature_valid ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </td>
                  <td className="py-2 px-3 text-sm">{log.event_type || '—'}</td>
                  <td className="py-2 px-3 font-mono text-xs">{log.tx_ref || '—'}</td>
                  <td className="py-2 px-3">
                    {log.processed ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">{log.skip_reason || '—'}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────
// Main Page
// ───────────────────────────────────────────────
export default function PaymentSafetyPage() {
  return (
    <SidebarProvider style={{ '--sidebar-width': 'calc(var(--spacing) * 72)', '--header-height': 'calc(var(--spacing) * 12)' } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Payment Safety" />

        <div className="px-6 py-6 space-y-6 w-full">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              title="Charge Verification"
              description="Verify any charge by TX Ref"
              icon={Search}
            />
            <SummaryCard
              title="Duplicate Detection"
              description="Monitor duplicate charges"
              icon={AlertTriangle}
            />
            <SummaryCard
              title="Suspicious Patterns"
              description="AI-powered fraud detection"
              icon={Shield}
            />
            <SummaryCard
              title="Webhook Audit"
              description="Full webhook audit trail"
              icon={FileText}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="receipts" className="space-y-4">
            <div className="flex gap-6 w-full">
              <TabsList className="flex flex-col h-auto items-stretch justify-start gap-1 bg-muted p-1 shrink-0">
                <TabsTrigger value="receipts" className="gap-2 justify-start">
                  <Search className="w-4 h-4" />
                  Verify Charge
                </TabsTrigger>
                <TabsTrigger value="duplicates" className="gap-2 justify-start">
                  <AlertTriangle className="w-4 h-4" />
                  Duplicates
                </TabsTrigger>
                <TabsTrigger value="suspicious" className="gap-2 justify-start">
                  <Shield className="w-4 h-4" />
                  Suspicious
                </TabsTrigger>
                <TabsTrigger value="reversals" className="gap-2 justify-start">
                  <RotateCcw className="w-4 h-4" />
                  Reversals
                </TabsTrigger>
                <TabsTrigger value="webhooks" className="gap-2 justify-start">
                  <FileText className="w-4 h-4" />
                  Webhook Audit
                </TabsTrigger>
              </TabsList>

              <div className="flex-1">
                <TabsContent value="receipts">
                  <ReceiptsTab />
                </TabsContent>
                <TabsContent value="duplicates">
                  <DuplicatesTab />
                </TabsContent>
                <TabsContent value="suspicious">
                  <SuspiciousTab />
                </TabsContent>
                <TabsContent value="reversals">
                  <ReversalsTab />
                </TabsContent>
                <TabsContent value="webhooks">
                  <WebhookAuditTab />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function SummaryCard({ title, description, icon: Icon }: {
  title: string
  description: string
  icon: React.ElementType
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-md bg-orange-500/10">
          <Icon className="w-4 h-4 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
