'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DisputeListResponse, DisputeSummary, DisputeDetail } from '@/types/dispute-types'
import { useState, useRef, useEffect } from 'react'
import React from 'react'
import { Search, Send, AlertTriangle, MessageSquare } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn, fetchApi } from '@/lib/utils'

const ADMIN_SENDER_ID = "admin"

function statusColor(status: string) {
  switch (status?.toUpperCase()) {
    case 'OPEN': return 'bg-red-500/15 text-red-600'
    case 'IN_PROGRESS': return 'bg-yellow-500/15 text-yellow-600'
    case 'RESOLVED': return 'bg-green-500/15 text-green-600'
    case 'CLOSED': return 'bg-gray-500/15 text-gray-600'
    default: return 'bg-gray-500/15 text-gray-600'
  }
}

function DisputeListItem({ dispute, selected, onClick }: { dispute: DisputeSummary; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3 border-b transition-colors hover:bg-muted/50',
        selected && 'bg-orange-500/10 border-l-2 border-l-orange-500'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm truncate">
          {dispute.raised_by?.full_name || 'Unknown'}
        </span>
        <Badge variant="secondary" className={cn('text-xs shrink-0 ml-2', statusColor(dispute.status))}>
          {dispute.status}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground truncate">{dispute.reason || 'No reason provided'}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-muted-foreground">{dispute.order_type}</span>
        {dispute.order_number && (
          <span className="text-xs text-muted-foreground">· #{dispute.order_number}</span>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {new Date(dispute.created_at).toLocaleDateString()}
        </span>
      </div>
    </button>
  )
}

export default function DisputesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [message, setMessage] = useState('')
  const [page, setPage] = useState(1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data, isLoading: listLoading } = useQuery<DisputeListResponse>({
    queryKey: ['disputes', page],
    queryFn: () => fetchApi(`/api/disputes?page=${page}&limit=20`),
  })

  const disputes = (data?.data ?? []).filter((d) => {
    const matchSearch = !search ||
      d.raised_by?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.reason?.toLowerCase().includes(search.toLowerCase()) ||
      String(d.order_number).includes(search)
    const matchStatus = !statusFilter || d.status === statusFilter
    return matchSearch && matchStatus
  })

  const { data: detail, isLoading: detailLoading } = useQuery<DisputeDetail>({
    queryKey: ['dispute-detail', selectedId],
    queryFn: () => fetchApi(`/api/disputes/${selectedId}`),
    enabled: !!selectedId,
    refetchInterval: 10000,
  })

  const sendMutation = useMutation({
    mutationFn: async (msg: string) => {
      const res = await fetch(`/api/disputes/${selectedId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      })
      if (!res.ok) throw new Error('Failed to send')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispute-detail', selectedId] })
      setMessage('')
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [detail?.messages])

  const handleSend = () => {
    if (!message.trim() || !selectedId) return
    sendMutation.mutate(message.trim())
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
        <SiteHeader title="Disputes" />

        <div className="flex h-[calc(100vh-var(--header-height))] overflow-hidden">
          {/* Left: Dispute List */}
          <div className="w-80 shrink-0 flex flex-col border-r">
            {/* Filters */}
            <div className="p-3 space-y-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search disputes..."
                  className="pl-9 h-8 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter || "ALL"} onValueChange={(v) => setStatusFilter(v === "ALL" ? "" : v)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {listLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : disputes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  No disputes found
                </div>
              ) : (
                disputes.map((d) => (
                  <DisputeListItem
                    key={d.id}
                    dispute={d}
                    selected={selectedId === d.id}
                    onClick={() => setSelectedId(d.id)}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {data?.meta && (
              <div className="flex items-center justify-between px-3 py-2 border-t text-xs text-muted-foreground">
                <span>{data.meta.total} total</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-6 px-2 text-xs" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</Button>
                  <Button variant="outline" size="sm" className="h-6 px-2 text-xs" onClick={() => setPage(p => p + 1)} disabled={page === data.meta.total_pages}>Next</Button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Chat UI */}
          <div className="flex-1 flex flex-col min-w-0">
            {!selectedId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
                <MessageSquare className="w-10 h-10 opacity-30" />
                <p className="text-sm">Select a dispute to view the conversation</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                {detailLoading ? (
                  <div className="px-4 py-3 border-b flex items-center gap-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-20 ml-auto" />
                  </div>
                ) : detail && (
                  <div className="px-4 py-3 border-b flex items-center gap-3 shrink-0">
                    <div>
                      <p className="font-semibold text-sm">{detail.raised_by?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {detail.order_type} · {detail.order_number ? `#${detail.order_number}` : detail.order_id}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Badge variant="secondary" className={cn('text-xs', statusColor(detail.status))}>
                        {detail.status}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Dispute Info */}
                {detail?.reason && (
                  <div className="px-4 py-2 bg-yellow-500/10 border-b text-xs text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span><span className="font-medium">Reason:</span> {detail.reason}</span>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {detailLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={cn('flex gap-2', i % 2 === 0 ? '' : 'flex-row-reverse')}>
                          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                          <Skeleton className="h-10 w-48 rounded-2xl" />
                        </div>
                      ))}
                    </div>
                  ) : detail?.messages?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                      <MessageSquare className="w-6 h-6 opacity-30" />
                      No messages yet
                    </div>
                  ) : (
                    detail?.messages?.map((msg) => {
                      const isAdmin = msg.sender_id === ADMIN_SENDER_ID
                      return (
                        <div key={msg.id} className={cn('flex gap-2 items-end', isAdmin && 'flex-row-reverse')}>
                          <Avatar className="w-7 h-7 shrink-0">
                            <AvatarImage src={msg.sender_image_url ?? undefined} />
                            <AvatarFallback className="text-xs">
                              {msg.sender_name?.[0]?.toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className={cn('max-w-[70%] space-y-1', isAdmin && 'items-end flex flex-col')}>
                            <p className="text-xs text-muted-foreground px-1">{msg.sender_name || 'Unknown'}</p>
                            <div className={cn(
                              'px-3 py-2 rounded-2xl text-sm',
                              isAdmin
                                ? 'bg-orange-500 text-white rounded-br-sm'
                                : 'bg-muted rounded-bl-sm'
                            )}>
                              {msg.message}
                            </div>
                            <p className="text-xs text-muted-foreground px-1">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Message Input */}
                <div className="px-4 py-3 border-t flex gap-2 shrink-0">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    disabled={sendMutation.isPending}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!message.trim() || sendMutation.isPending}
                    className="bg-orange-500 hover:bg-orange-600 text-white shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
