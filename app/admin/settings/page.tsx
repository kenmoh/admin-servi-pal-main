'use client'

import React, { useState, useEffect } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Bell, Lock, Palette, ReceiptText, User } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

interface ChargesResponse {
  id: string
  payment_gateway_fee: string
  value_added_tax: string
  payout_charge_upto_5000: string
  payout_charge_5001_to_50000: string
  payout_charge_above_50000: string
  stamp_duty: string
  base_delivery_fee: string
  delivery_fee_per_km: string
  delivery_commission_percentage: string
  food_commission_percentage: string
  laundry_commission_percentage: string
  product_commission_percentage: string
  delivery_commission_rate: string
  food_commission_rate: string
  laundry_commission_rate: string
  product_commission_rate: string
  created_at: string
  updated_at: string | null
}

const TABS = [
  { id: 'general', label: 'General', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'charges', label: 'Charges', icon: ReceiptText },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Lock },
]

function ChargesField({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-8"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function ChargesTab() {
  const queryClient = useQueryClient()
  const { data: chargesList, isLoading } = useQuery<ChargesResponse[]>({
    queryKey: ['charges'],
    queryFn: async () => {
      const res = await fetch('/api/charges')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  type FormFields = Omit<ChargesResponse, 'id' | 'created_at' | 'updated_at'>
  const charges = chargesList?.[0]
  const [form, setForm] = useState<FormFields | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (charges) {
      const { id, created_at, updated_at, ...rest } = charges
      setForm(rest)
    }
  }, [charges])

  const setField = (key: keyof FormFields) => (v: string) =>
    setForm((prev) => prev ? { ...prev, [key]: v } : prev)

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form) return
      const url = charges ? `/api/charges/${charges.id}` : '/api/charges'
      const method = charges ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charges'] })
      setSuccess(true)
      setError(null)
      setTimeout(() => setSuccess(false), 3000)
    },
    onError: () => setError('Failed to save charges. Make sure you have SUPER_ADMIN access.'),
  })

  if (isLoading) return (
    <div className="space-y-4">
      {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
    </div>
  )

  if (!form) return null

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded">{error}</p>}
      {success && <p className="text-sm text-green-600 bg-green-500/10 px-3 py-2 rounded">Charges saved successfully.</p>}

      <Card>
        <CardHeader>
          <CardTitle>Platform Fees</CardTitle>
          <CardDescription>Gateway, tax and stamp duty rates</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChargesField label="Payment Gateway Fee" value={form.payment_gateway_fee} onChange={setField('payment_gateway_fee')} hint="Charged per transaction" />
          <ChargesField label="Value Added Tax (VAT)" value={form.value_added_tax} onChange={setField('value_added_tax')} />
          <ChargesField label="Stamp Duty" value={form.stamp_duty} onChange={setField('stamp_duty')} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout Charges</CardTitle>
          <CardDescription>Tiered payout fees by amount</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChargesField label="Up to ₦5,000" value={form.payout_charge_upto_5000} onChange={setField('payout_charge_upto_5000')} />
          <ChargesField label="₦5,001 – ₦50,000" value={form.payout_charge_5001_to_50000} onChange={setField('payout_charge_5001_to_50000')} />
          <ChargesField label="Above ₦50,000" value={form.payout_charge_above_50000} onChange={setField('payout_charge_above_50000')} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Fees</CardTitle>
          <CardDescription>Base fee and per-km rate for delivery orders</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Base Delivery Fee (₦)</label>
            <Input type="number" min="0" step="0.01" value={form.base_delivery_fee} onChange={(e) => setField('base_delivery_fee')(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Fee per KM (₦)</label>
            <Input type="number" min="0" step="0.01" value={form.delivery_fee_per_km} onChange={(e) => setField('delivery_fee_per_km')(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Percentages</CardTitle>
          <CardDescription>Platform commission per service type</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChargesField label="Delivery Commission %" value={form.delivery_commission_percentage} onChange={setField('delivery_commission_percentage')} />
          <ChargesField label="Food Commission %" value={form.food_commission_percentage} onChange={setField('food_commission_percentage')} />
          <ChargesField label="Laundry Commission %" value={form.laundry_commission_percentage} onChange={setField('laundry_commission_percentage')} />
          <ChargesField label="Product Commission %" value={form.product_commission_percentage} onChange={setField('product_commission_percentage')} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Rates</CardTitle>
          <CardDescription>Fixed rate commissions per service type</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChargesField label="Delivery Commission Rate" value={form.delivery_commission_rate} onChange={setField('delivery_commission_rate')} />
          <ChargesField label="Food Commission Rate" value={form.food_commission_rate} onChange={setField('food_commission_rate')} />
          <ChargesField label="Laundry Commission Rate" value={form.laundry_commission_rate} onChange={setField('laundry_commission_rate')} />
          <ChargesField label="Product Commission Rate" value={form.product_commission_rate} onChange={setField('product_commission_rate')} />
        </CardContent>
      </Card>

      <Button
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending}
      >
        {saveMutation.isPending ? 'Saving...' : charges ? 'Update Charges' : 'Create Charges Config'}
      </Button>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [orderAlerts, setOrderAlerts] = useState(true)
  const [complaintNotifications, setComplaintNotifications] = useState(true)

  return (
    <SidebarProvider
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Settings" />

        <div className="flex h-[calc(100vh-var(--header-height))] overflow-hidden">
          {/* Vertical tab nav */}
          <aside className="w-48 shrink-0 border-r py-4 flex flex-col gap-1 px-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left',
                  activeTab === id
                    ? 'bg-orange-500/15 text-orange-600'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </aside>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-3xl space-y-6">

              {activeTab === 'general' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Update your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <Input defaultValue="Alex Admin" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input type="email" defaultValue="admin@servipal.com" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone</label>
                          <Input defaultValue="+234-800-0000" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Role</label>
                          <Input defaultValue="Super Admin" disabled />
                        </div>
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                      <CardDescription>Configure your platform details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Platform Name</label>
                        <Input defaultValue="ServiPal" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Support Email</label>
                        <Input type="email" defaultValue="support@servipal.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Support Phone</label>
                        <Input defaultValue="+234-800-0000" />
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" /> Notification Preferences
                      </CardTitle>
                      <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: 'Email Notifications', desc: 'Receive notifications via email', value: emailNotifications, handler: setEmailNotifications },
                        { label: 'Push Notifications', desc: 'Receive browser push notifications', value: pushNotifications, handler: setPushNotifications },
                        { label: 'Order Alerts', desc: 'Get notified on new orders', value: orderAlerts, handler: setOrderAlerts },
                        { label: 'Complaint Notifications', desc: 'Get notified on new complaints', value: complaintNotifications, handler: setComplaintNotifications },
                      ].map(({ label, desc, value, handler }, i, arr) => (
                        <React.Fragment key={label}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-muted-foreground">{desc}</p>
                            </div>
                            <Switch checked={value} onCheckedChange={handler} />
                          </div>
                          {i < arr.length - 1 && <Separator />}
                        </React.Fragment>
                      ))}
                      <Button className="w-full mt-2">Save Preferences</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Schedule</CardTitle>
                      <CardDescription>Set quiet hours for notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Quiet Hours Start</label>
                          <Input type="time" defaultValue="22:00" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Quiet Hours End</label>
                          <Input type="time" defaultValue="08:00" />
                        </div>
                      </div>
                      <Button>Save Schedule</Button>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeTab === 'charges' && <ChargesTab />}

              {activeTab === 'appearance' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" /> Theme Settings
                    </CardTitle>
                    <CardDescription>Customize the appearance of your dashboard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="font-medium mb-3">Color Scheme</p>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Light', bg: 'bg-white dark:bg-slate-950', dot: 'bg-gray-900' },
                          { label: 'Dark', bg: 'bg-slate-950', dot: 'bg-white', textClass: 'text-white', active: true },
                          { label: 'Auto', bg: '', dot: null },
                        ].map(({ label, bg, dot, textClass, active }) => (
                          <button key={label} className={`h-24 rounded-lg border-2 ${active ? 'border-orange-500' : 'border-border hover:border-orange-500'} ${bg} flex flex-col items-center justify-center gap-2 transition-colors`}>
                            {dot ? <div className={`w-8 h-8 rounded-full ${dot}`} /> : (
                              <div className="flex gap-2">
                                <div className="w-4 h-4 rounded-full bg-gray-900" />
                                <div className="w-4 h-4 rounded-full bg-white border border-gray-900" />
                              </div>
                            )}
                            <span className={`text-xs font-medium ${textClass ?? ''}`}>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-medium mb-3">Accent Color</p>
                      <div className="flex gap-3">
                        {[
                          { color: 'bg-orange-500', active: true },
                          { color: 'bg-blue-500' },
                          { color: 'bg-green-500' },
                          { color: 'bg-purple-500' },
                          { color: 'bg-red-500' },
                        ].map(({ color, active }, i) => (
                          <button key={i} className={`w-10 h-10 rounded-lg ${color} border-2 ${active ? 'border-white scale-110' : 'border-transparent'} transition-transform`} />
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">Save Preferences</Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'security' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5" /> Password & Security
                      </CardTitle>
                      <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <Input type="password" placeholder="Enter current password" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <Input type="password" placeholder="Enter new password" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <Input type="password" placeholder="Confirm new password" />
                      </div>
                      <Button>Update Password</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>Add an extra layer of security to your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Two-factor authentication is currently disabled. Enable it to add extra security.
                      </p>
                      <Button>Enable 2FA</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Active Sessions</CardTitle>
                      <CardDescription>Manage your active login sessions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Current Session</p>
                          <p className="text-xs text-muted-foreground">Last active: Just now</p>
                        </div>
                        <span className="text-xs font-medium text-green-500">Active</span>
                      </div>
                      <Button variant="outline" className="w-full">Sign Out All Sessions</Button>
                    </CardContent>
                  </Card>
                </>
              )}

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
