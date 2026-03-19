'use client'

import React, { useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { AuditLogEntry, AuditLogListResponse } from '@/types/audit-log-types'
import { Search, X, ChevronDown, ChevronRight, Monitor, User } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const ENTITY_TYPES = ['profiles', 'wallets', 'delivery-orders', 'disputes', 'charges']

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-green-500/15 text-green-600',
  CREATE_MANAGEMENT_USER: 'bg-green-500/15 text-green-600',
  UPDATE: 'bg-blue-500/15 text-blue-600',
  DELETE: 'bg-red-500/15 text-red-600',
  BLOCK_USER: 'bg-orange-500/15 text-orange-600',
  UNBLOCK_USER: 'bg-teal-500/15 text-teal-600',
  SUSPEND: 'bg-yellow-500/15 text-yellow-600',
  RESOLVE: 'bg-purple-500/15 text-purple-600',
}

function actionColor(action: string) {
  return ACTION_COLORS[action] ?? 'bg-gray-500/15 text-gray-600'
}

function JsonDiff({ label, value }: { label: string; value: Record<string, unknown> | null }) {
  const [open, setOpen] = useState(false)
  if (!value) return null
  return (
    <div className="text-xs">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        {label}
      </button>
      {open && (
        <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto max-w-xs">
          {JSON.stringify(value, null, 2)}
        </pre>
      )}
    </div>
  )
}

function LogRow({ log, onClick, selected }: { log: AuditLogEntry; onClick: () => void; selected: boolean }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b cursor-pointer transition-colors hover:bg-muted/50 text-sm',
        selected && 'bg-orange-500/10'
      )}
    >
      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
        {new Date(log.created_at).toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <Badge variant="secondary" className={cn('text-xs font-mono', actionColor(log.action))}>
          {log.action}
        </Badge>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{log.entity_type}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[140px]">
        {log.entity_id}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {log.actor_type === 'SYSTEM' ? (
            <Monitor className="w-3 h-3" />
          ) : (
            <User className="w-3 h-3" />
          )}
          <span className="font-mono truncate max-w-[120px]">{log.actor_id ?? log.actor_type}</span>
        </div>
      </td>
    </tr>
  )
}

function LogDetail({ log }: { log: AuditLogEntry }) {
  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className={cn('font-mono', actionColor(log.action))}>
          {log.action}
        </Badge>
        <span className="text-muted-foreground text-xs">{new Date(log.created_at).toLocaleString()}</span>
      </div>

      <div className="space-y-2">
        {[
          { label: 'Log ID', value: log.id },
          { label: 'Entity Type', value: log.entity_type },
          { label: 'Entity ID', value: log.entity_id },
          { label: 'Actor ID', value: log.actor_id },
          { label: 'Actor Type', value: log.actor_type },
          { label: 'Change Amount', value: log.change_amount },
          { label: 'IP Address', value: log.ip_address },
        ].map(({ label, value }) =>
          value ? (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-muted-foreground shrink-0">{label}</span>
              <span className="font-mono text-xs text-right break-all">{value}</span>
            </div>
          ) : null
        )}
      </div>

      {log.notes && (
        <>
          <Separator />
          <div>
            <p className="text-muted-foreground text-xs mb-1">Notes</p>
            <p className="text-sm">{log.notes}</p>
          </div>
        </>
      )}

      {(log.old_value || log.new_value) && (
        <>
          <Separator />
          <div className="space-y-2">
            <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">Changes</p>
            <JsonDiff label="Old Value" value={log.old_value} />
            <JsonDiff label="New Value" value={log.new_value} />
          </div>
        </>
      )}

      <Separator />
      <div>
        <p className="text-muted-foreground text-xs mb-1">User Agent</p>
        <p className="text-xs font-mono break-all text-muted-foreground">{log.user_agent}</p>
      </div>
    </div>
  )
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [entityType, setEntityType] = useState('')
  const [action, setAction] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selected, setSelected] = useState<AuditLogEntry | null>(null)

  const params = new URLSearchParams({ page: String(page), page_size: '20' })
  if (entityType) params.set('entity_type', entityType)
  if (action) params.set('action', action)
  if (dateFrom) params.set('date_from', dateFrom)
  if (dateTo) params.set('date_to', dateTo)

  const { data, isLoading } = useQuery<AuditLogListResponse>({
    queryKey: ['audit-logs', page, entityType, action, dateFrom, dateTo],
    queryFn: async () => {
      const res = await fetch(`/api/audit-logs?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const logs = (data?.data ?? []).filter((l) =>
    !search ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity_type.toLowerCase().includes(search.toLowerCase()) ||
    l.entity_id.toLowerCase().includes(search.toLowerCase()) ||
    (l.actor_id ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const hasFilters = search || entityType || action || dateFrom || dateTo
  const clearFilters = () => {
    setSearch(''); setEntityType(''); setAction(''); setDateFrom(''); setDateTo('')
    setPage(1)
  }

  return (
    <SidebarProvider
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Audit Logs" />

        <div className="flex h-[calc(100vh-var(--header-height))] overflow-hidden">
          {/* Main log list */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Filters */}
            <div className="px-4 py-3 border-b flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-40">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search action, entity, actor..."
                  className="pl-9 h-8 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select value={entityType || 'ALL'} onValueChange={(v) => { setEntityType(v === 'ALL' ? '' : v); setPage(1) }}>
                <SelectTrigger className="h-8 text-sm w-40">
                  <SelectValue placeholder="Entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All entities</SelectItem>
                  {ENTITY_TYPES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>

              <Input
                type="text"
                placeholder="Action (e.g. BLOCK_USER)"
                className="h-8 text-sm w-44"
                value={action}
                onChange={(e) => { setAction(e.target.value); setPage(1) }}
              />

              <Input type="date" className="h-8 text-sm w-36" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} />
              <Input type="date" className="h-8 text-sm w-36" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} />

              {hasFilters && (
                <Button variant="ghost" size="sm" className="h-8" onClick={clearFilters}>
                  <X className="w-3.5 h-3.5 mr-1" /> Clear
                </Button>
              )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background border-b">
                  <tr className="text-xs text-muted-foreground">
                    <th className="px-4 py-2 text-left font-medium">Timestamp</th>
                    <th className="px-4 py-2 text-left font-medium">Action</th>
                    <th className="px-4 py-2 text-left font-medium">Entity Type</th>
                    <th className="px-4 py-2 text-left font-medium">Entity ID</th>
                    <th className="px-4 py-2 text-left font-medium">Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">
                        No audit logs found
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <LogRow
                        key={log.id}
                        log={log}
                        selected={selected?.id === log.id}
                        onClick={() => setSelected(selected?.id === log.id ? null : log)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data?.meta && (
              <div className="flex items-center justify-between px-4 py-2 border-t text-xs text-muted-foreground">
                <span>
                  Page {data.meta.page} of {data.meta.total_pages} — {data.meta.total} total
                </span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPage((p) => p + 1)} disabled={page === data.meta.total_pages}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-80 shrink-0 border-l overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <p className="font-semibold text-sm">Log Detail</p>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelected(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <LogDetail log={selected} />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
