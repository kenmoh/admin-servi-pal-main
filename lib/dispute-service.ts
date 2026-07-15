import { supabase } from '@/supabase/supabase'
import {
  DisputeDetails,
  DisputeListResponse,
  DisputeMessagesResponse,
  SendMessageRequest,
  DisputeMessage,
  Dispute,
  DisputeUnreadCount,
  DisputeStatus,
} from '@/types/dispute-types'
import { RealtimeChannel } from '@supabase/supabase-js'

async function requestJson(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed with status ${response.status}`)
  }

  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const getDisputes = async (params: {
  page?: number
  limit?: number
  status?: DisputeStatus | null
  search?: string
}): Promise<DisputeListResponse> => {
  const searchParams = new URLSearchParams({
    page: String(params.page ?? 1),
    page_size: String(params.limit ?? 20),
    ...(params.status ? { status: params.status } : {}),
    ...(params.search ? { search: params.search } : {}),
  })

  const data = await requestJson(`/api/disputes?${searchParams.toString()}`)

  return {
    data: data?.data ?? [],
    meta: data?.meta ?? {
      total: 0,
      page: params.page ?? 1,
      page_size: params.limit ?? 20,
      total_pages: 1,
    },
  } as DisputeListResponse
}

export const getDisputeDetails = async (disputeId: string): Promise<DisputeDetails> => {
  const data = await requestJson(`/api/disputes/${disputeId}`)
  return data as DisputeDetails
}

export const getDisputeMessages = async (
  disputeId: string,
  limit = 50,
  offset = 0,
): Promise<DisputeMessagesResponse> => {
  const data = await requestJson(`/api/disputes/${disputeId}/messages?limit=${limit}&offset=${offset}`)
  return {
    messages: data?.messages ?? data?.data ?? [],
    total_count: data?.total_count ?? data?.total ?? 0,
  } as DisputeMessagesResponse
}

export const sendDisputeMessage = async (
  request: SendMessageRequest,
): Promise<{ id: string }> => {
  const data = await requestJson(`/api/disputes/${request.dispute_id}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      message_text: request.message_text,
      attachments: request.attachments ?? null,
    }),
  })
  return data as { id: string }
}

export const getDisputeUnreadCount = async (
  disputeId: string,
  userId?: string,
): Promise<DisputeUnreadCount> => {
  const data = await requestJson(`/api/disputes/${disputeId}/read?userId=${encodeURIComponent(userId ?? '')}`)
  return data as DisputeUnreadCount
}

export const markDisputeAsRead = async (disputeId: string): Promise<void> => {
  await requestJson(`/api/disputes/${disputeId}/read`, { method: 'POST' })
}

export const updateDisputeStatus = async (
  disputeId: string,
  status: DisputeStatus,
): Promise<Dispute> => {
  const data = await requestJson(`/api/disputes/${disputeId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return data as Dispute
}

export const subscribeToDisputeMessages = (
  disputeId: string,
  onNewMessage: (message: DisputeMessage) => void,
): RealtimeChannel =>
  supabase
    .channel(`dispute-${disputeId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'dispute_messages', filter: `dispute_id=eq.${disputeId}` },
      (payload) => onNewMessage(payload.new as DisputeMessage),
    )
    .subscribe()

export const subscribeToDisputeUpdates = (
  disputeId: string,
  onUpdate: (dispute: Dispute) => void,
): RealtimeChannel =>
  supabase
    .channel(`dispute-updates-${disputeId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'disputes', filter: `id=eq.${disputeId}` },
      (payload) => onUpdate(payload.new as Dispute),
    )
    .subscribe()
