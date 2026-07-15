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
import {
  Dispute,
  DisputeDetails,
  DisputeListItem,
  DisputeListResponse,
  DisputeMessage,
  DisputeMessagesResponse,
  DisputeStatus,
} from '@/types/dispute-types'
import {
  getDisputes,
  getDisputeDetails,
  getDisputeMessages,
  sendDisputeMessage,
  markDisputeAsRead,
  subscribeToDisputeMessages,
  subscribeToDisputeUpdates,
  getDisputeUnreadCount,
  updateDisputeStatus,
} from '@/lib/dispute-service'
import { useState, useRef, useEffect } from 'react'
import { useAppContext } from '@/lib/context'
import React from 'react'
import { Search, Send, AlertTriangle, MessageSquare } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

function statusColor(status: DisputeStatus | string) {
  switch (status?.toUpperCase()) {
    case 'OPEN': return 'bg-red-500/15 text-red-600'
    case 'UNDER_REVIEW': return 'bg-yellow-500/15 text-yellow-600'
    case 'ESCALATED': return 'bg-orange-500/15 text-orange-600'
    case 'RESOLVED': return 'bg-green-500/15 text-green-600'
    case 'CLOSED':
    case 'CANCELLED': return 'bg-gray-500/15 text-gray-600'
    default: return 'bg-gray-500/15 text-gray-600'
  }
}

function formatStatusLabel(status: DisputeStatus | string) {
  return status?.replace(/_/g, ' ') ?? ''
}

function DisputeListItemRow({ dispute, selected, onClick, unreadCount }: {
  dispute: DisputeListItem
  selected: boolean
  onClick: () => void
  unreadCount: number
}) {
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
          {dispute.other_party_name || dispute.order_type || 'Dispute'}
        </span>
          <Badge variant="secondary" className={cn('text-xs shrink-0 ml-2', statusColor(dispute.status))}>
          {formatStatusLabel(dispute.status)}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground truncate">{dispute.reason || 'No reason provided'}</p>
      <div className="flex items-center gap-2 mt-1">
        {dispute.order_id && (
          <span className="text-xs text-muted-foreground">#{dispute.order_id.slice(0, 8)}</span>
        )}
        {unreadCount > 0 && (
          <span className="ml-auto bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
            {unreadCount}
          </span>
        )}
        <span className={cn('text-xs text-muted-foreground', unreadCount > 0 ? '' : 'ml-auto')}>
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
  const [realtimeMessages, setRealtimeMessages] = useState<DisputeMessage[]>([])
  const [detailStatus, setDetailStatus] = useState<DisputeStatus | null>(null)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [statusUpdating, setStatusUpdating] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const { currentUser } = useAppContext()

  const { data, isLoading: listLoading } = useQuery<DisputeListResponse>({
    queryKey: ['disputes', page, statusFilter, search],
    queryFn: () => getDisputes({
      page,
      limit: 20,
      status: (statusFilter || null) as DisputeStatus | null,
      search,
    }),
  })

  const disputes = data?.data ?? []

  useEffect(() => {
    if (!disputes.length) return

    const loadUnreadCounts = async () => {
      const nextCounts: Record<string, number> = {}
      await Promise.allSettled(
        disputes.map(async (d) => {
          const res = await getDisputeUnreadCount(d.id)
          nextCounts[d.id] = res.unread_count
        }),
      )
      setUnreadCounts(nextCounts)
    }

    loadUnreadCounts()
  }, [disputes])

  const { data: detail, isLoading: detailLoading } = useQuery<DisputeDetails>({
    queryKey: ['dispute-detail', selectedId],
    queryFn: () => getDisputeDetails(selectedId!),
    enabled: !!selectedId,
    refetchInterval: 10000,
  })

  const { data: messagesData, isLoading: messagesLoading } = useQuery<DisputeMessagesResponse>({
    queryKey: ['dispute-messages', selectedId],
    queryFn: () => getDisputeMessages(selectedId!),
    enabled: !!selectedId,
    refetchInterval: 10000,
  })

  const messages = messagesData?.messages ?? []
  const allMessages = [
    ...messages,
    ...realtimeMessages.filter((r) => !messages.some((m) => m.id === r.id)),
  ]

  useEffect(() => {
    setRealtimeMessages([])
    setDetailStatus(null)
    if (detail?.status) {
      setDetailStatus(detail.status)
    }
  }, [selectedId, detail?.status])

  // Realtime subscriptions
  useEffect(() => {
    if (!selectedId) return
    const msgChannel = subscribeToDisputeMessages(selectedId, (newMsg) => {
      setRealtimeMessages((prev) =>
        prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]
      )
      setUnreadCounts((prev) => ({ ...prev, [selectedId]: 0 }))
      markDisputeAsRead(selectedId).catch(() => {})
    })
    const updateChannel = subscribeToDisputeUpdates(selectedId, (updated: Dispute) => {
      setDetailStatus(updated.status)
      queryClient.invalidateQueries({ queryKey: ['disputes'] })
    })
    return () => {
      msgChannel.unsubscribe()
      updateChannel.unsubscribe()
    }
  }, [selectedId, queryClient])

  // Clear unread + mark read on select
  useEffect(() => {
    if (!selectedId) return
    setUnreadCounts((prev) => ({ ...prev, [selectedId]: 0 }))
    markDisputeAsRead(selectedId).catch(() => {})
  }, [selectedId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages.length])

  const sendMutation = useMutation({
    mutationFn: (msg: string) =>
      sendDisputeMessage({ dispute_id: selectedId!, message_text: msg }),
    onMutate: async (msgText) => {
      await queryClient.cancelQueries({ queryKey: ['dispute-messages', selectedId] })
      const previousData = queryClient.getQueryData<DisputeMessagesResponse>(['dispute-messages', selectedId])
      const optimisticMessage: DisputeMessage = {
        id: `temp-${Date.now()}`,
        dispute_id: selectedId!,
        sender_id: currentUser?.id ?? '',
        message_text: msgText,
        attachments: null,
        created_at: new Date().toISOString(),
        sender: {
          id: currentUser?.id ?? '',
          full_name: currentUser?.name ?? 'You',
          profile_image_url: currentUser?.avatar ?? null,
          user_type: 'ADMIN',
        },
      }
      queryClient.setQueryData(['dispute-messages', selectedId], (old: DisputeMessagesResponse | undefined) => ({
        messages: [...(old?.messages ?? []), optimisticMessage],
        total_count: (old?.total_count ?? 0) + 1,
      }))
      return { previousData }
    },
    onError: (_err, _msg, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['dispute-messages', selectedId], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dispute-messages', selectedId] })
      queryClient.invalidateQueries({ queryKey: ['disputes'] })
      setRealtimeMessages([])
    },
  })

  const handleSend = () => {
    if (!message.trim() || !selectedId) return
    setMessage('')
    sendMutation.mutate(message.trim())
  }

  const handleStatusChange = async (status: DisputeStatus) => {
    if (!selectedId) return
    setStatusUpdating(true)
    try {
      const updated = await updateDisputeStatus(selectedId, status)
      setDetailStatus(updated.status)
      queryClient.invalidateQueries({ queryKey: ['disputes'] })
      queryClient.invalidateQueries({ queryKey: ['dispute-detail', selectedId] })
    } finally {
      setStatusUpdating(false)
    }
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
            <div className="p-3 space-y-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search disputes..."
                  className="pl-9 h-8 text-sm"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                />
              </div>
              <Select value={statusFilter || 'ALL'} onValueChange={(v) => { setStatusFilter(v === 'ALL' ? '' : v); setPage(1) }}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="ESCALATED">Escalated</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <DisputeListItemRow
                    key={d.id}
                    dispute={d}
                    selected={selectedId === d.id}
                    onClick={() => setSelectedId(d.id)}
                    unreadCount={unreadCounts[d.id] ?? d.unread_count}
                  />
                ))
              )}
            </div>

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
                      <p className="font-semibold text-sm">
                        {detail.initiator?.full_name || 'Unknown'} vs {detail.respondent?.full_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {detail.order_type} · #{detail.order_id?.slice(0, 8)}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Select
                        value={(detailStatus ?? detail.status) as string}
                        onValueChange={(value) => handleStatusChange(value as DisputeStatus)}
                        disabled={statusUpdating}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                          <SelectItem value="ESCALATED">Escalated</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge variant="secondary" className={cn('text-xs', statusColor(detailStatus ?? detail.status))}>
                        {formatStatusLabel(detailStatus ?? detail.status)}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Reason banner */}
                {detail?.reason && (
                  <div className="px-4 py-2 bg-yellow-500/10 border-b text-xs text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span><span className="font-medium">Reason:</span> {detail.reason}</span>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={cn('flex gap-2', i % 2 === 0 ? '' : 'flex-row-reverse')}>
                          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                          <Skeleton className="h-10 w-48 rounded-2xl" />
                        </div>
                      ))}
                    </div>
                  ) : allMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                      <MessageSquare className="w-6 h-6 opacity-30" />
                      No messages yet
                    </div>
                  ) : (
                    allMessages.map((msg) => {
                      const isAdmin = msg.sender?.user_type === 'ADMIN' || msg.sender?.user_type === 'SUPER_ADMIN'
                      return (
                        <div key={msg.id} className={cn('flex gap-2 items-end', isAdmin && 'flex-row-reverse')}>
                          <Avatar className="w-7 h-7 shrink-0">
                            <AvatarImage src={msg.sender?.profile_image_url ?? undefined} />
                            <AvatarFallback className="text-xs">
                              {msg.sender?.full_name?.[0]?.toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className={cn('max-w-[70%] space-y-1', isAdmin && 'items-end flex flex-col')}>
                            <p className="text-xs text-muted-foreground px-1">{msg.sender?.full_name || 'Unknown'}</p>
                            <div className={cn(
                              'px-3 py-2 rounded-2xl text-sm',
                              isAdmin
                                ? 'bg-orange-500 text-white rounded-br-sm'
                                : 'bg-muted rounded-bl-sm'
                            )}>
                              {msg.message_text}
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
