'use client'

import React, { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/site-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchApi } from '@/lib/utils'
import { TransactionResponse } from '@/types/transaction-types'
import {
  Receipt, Search, AlertTriangle, Shield, RotateCcw,
  CheckCircle, XCircle, Clock, Ban, FileText,
  RefreshCw, DollarSign, Loader2,
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
  tx_id: number | null
  processed: boolean
  skip_reason: string
  error_message: string | null
  created_at: string
}

// ───────────────────────────────────────────────
// Tab: Receipts
// ───────────────────────────────────────────────
function ReceiptsTab({ onLoadingChange }: { onLoadingChange?: (loading: boolean) => void }) {
  const [searchTxRef, setSearchTxRef] = useState('')
  const [verifyTriggered, setVerifyTriggered] = useState(false)

  const { data: result, isLoading, error, refetch } = useQuery<TransactionResponse>({
    queryKey: ['receipt', searchTxRef],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/${searchTxRef}/verify`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Verification failed')
      }
      return res.json()
    },
    enabled: false,
  })

  useEffect(() => { onLoadingChange?.(isLoading) }, [isLoading, onLoadingChange])

  const receiptData = result?.data

  const handleVerify = () => {
    if (!searchTxRef) return
    refetch()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Enter tx_ref to verify..."
            className="pl-10"
            value={searchTxRef}
            onChange={(e) => { setSearchTxRef(e.target.value); setVerifyTriggered(false) }}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          />
        </div>
        <Button onClick={handleVerify} disabled={!searchTxRef || isLoading}>
          {isLoading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          Verify
        </Button>
      </div>

      {isLoading && (
        <LoadingState label="Verifying charge..." />
      )}

      {error && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-4 h-4" />
              <p className="text-sm">Charge not found or verification failed</p>
            </div>
          </CardContent>
        </Card>
      )}

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
              <span className="font-bold text-green-600">
                {receiptData.amount ? `₦${Number(receiptData.amount).toLocaleString()}` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Currency</span>
              <span className="text-sm">{receiptData.currency || 'NGN'}</span>
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
            {receiptData.customer && (
              <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                <p className="text-sm font-medium text-green-600">
                  Customer: {receiptData.customer.name} ({receiptData.customer.email})
                </p>
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
function DuplicatesTab({ onLoadingChange }: { onLoadingChange?: (loading: boolean) => void }) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<{ count: number; alerts: DuplicateAlert[] }>({
    queryKey: ['duplicates'],
    queryFn: () => fetchApi('/api/payments?endpoint=duplicates'),
  })

  useEffect(() => { onLoadingChange?.(isLoading) }, [isLoading, onLoadingChange])

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

  if (isLoading) return <LoadingState label="Loading duplicates..." />

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
function SuspiciousTab({ onLoadingChange }: { onLoadingChange?: (loading: boolean) => void }) {
  const { data, isLoading } = useQuery<{ count: number; patterns: SuspiciousPattern[] }>({
    queryKey: ['suspicious'],
    queryFn: () => fetchApi('/api/payments?endpoint=suspicious'),
  })

  useEffect(() => { onLoadingChange?.(isLoading) }, [isLoading, onLoadingChange])

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

  if (isLoading) return <LoadingState label="Loading suspicious patterns..." />

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
function ReversalsTab({ onLoadingChange }: { onLoadingChange?: (loading: boolean) => void }) {
  const { data, isLoading } = useQuery<{ count: number; reversals: Reversal[] }>({
    queryKey: ['reversals'],
    queryFn: () => fetchApi('/api/payments?endpoint=reversals'),
  })

  useEffect(() => { onLoadingChange?.(isLoading) }, [isLoading, onLoadingChange])

  const reversals = data?.reversals ?? []

  if (isLoading) return <LoadingState label="Loading reversals..." />

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
function WebhookAuditTab({ onLoadingChange }: { onLoadingChange?: (loading: boolean) => void }) {
  const { data, isLoading } = useQuery<{ count: number; logs: WebhookLog[] }>({
    queryKey: ['webhook-audit'],
    queryFn: () => fetchApi('/api/payments?endpoint=webhook-audit'),
  })

  useEffect(() => { onLoadingChange?.(isLoading) }, [isLoading, onLoadingChange])

  const logs = data?.logs ?? []

  if (isLoading) return <LoadingState label="Loading webhook logs..." />

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
                <th className="py-2 px-3">TX ID</th>
                <th className="py-2 px-3">Processed</th>
                <th className="py-2 px-3">Skip Reason / Error</th>
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
                  <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{log.tx_id ?? '—'}</td>
                  <td className="py-2 px-3">
                    {log.processed ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">
                    {log.skip_reason || log.error_message || '—'}
                  </td>
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
  const [activeTab, setActiveTab] = useState('receipts')
  const [tabLoading, setTabLoading] = useState<Record<string, boolean>>({})

  const setTabLoadingFor = (tab: string) => (loading: boolean) =>
    setTabLoading((prev) => (prev[tab] === loading ? prev : { ...prev, [tab]: loading }))

  const renderTrigger = (value: string, icon: React.ReactNode, label: string) => (
    <TabsTrigger value={value} className="gap-2">
      {icon}
      {label}
      {tabLoading[value] && <Loader2 className="w-3 h-3 animate-spin" />}
    </TabsTrigger>
  )

  return (
    <>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            {renderTrigger('receipts', <Search className="w-4 h-4" />, 'Verify Charge')}
            {renderTrigger('duplicates', <AlertTriangle className="w-4 h-4" />, 'Duplicates')}
            {renderTrigger('suspicious', <Shield className="w-4 h-4" />, 'Suspicious')}
            {renderTrigger('reversals', <RotateCcw className="w-4 h-4" />, 'Reversals')}
            {renderTrigger('webhooks', <FileText className="w-4 h-4" />, 'Webhook Audit')}
          </TabsList>

          <TabsContent value="receipts">
            <ReceiptsTab onLoadingChange={setTabLoadingFor('receipts')} />
          </TabsContent>
          <TabsContent value="duplicates">
            <DuplicatesTab onLoadingChange={setTabLoadingFor('duplicates')} />
          </TabsContent>
          <TabsContent value="suspicious">
            <SuspiciousTab onLoadingChange={setTabLoadingFor('suspicious')} />
          </TabsContent>
          <TabsContent value="reversals">
            <ReversalsTab onLoadingChange={setTabLoadingFor('reversals')} />
          </TabsContent>
          <TabsContent value="webhooks">
            <WebhookAuditTab onLoadingChange={setTabLoadingFor('webhooks')} />
          </TabsContent>
        </Tabs>
      </div>
    </>
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

function LoadingState({ label }: { label: string }) {
  return (
    <Card className="p-12 text-center">
      <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground/60" />
      <p className="text-muted-foreground">{label}</p>
    </Card>
  )
}
