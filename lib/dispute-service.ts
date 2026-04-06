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

export const getDisputes = async (params: {
  page?: number
  limit?: number
  status?: DisputeStatus | null
  search?: string
}): Promise<DisputeListResponse> => {
  const { data, error } = await supabase.rpc('get_disputes', {
    p_page: params.page ?? 1,
    p_limit: params.limit ?? 20,
    p_status: params.status || null,
    p_search: params.search || null
  })

  if (error) throw new Error(error.message)
  // RPC returns a single jsonb — supabase wraps it as array[0] with the value under the function name key
  const raw = Array.isArray(data) ? data[0] : data
  const result = raw?.get_disputes ?? raw
 
  return result as DisputeListResponse
}

export const getDisputeDetails = async (disputeId: string): Promise<DisputeDetails> => {
  const { data, error } = await supabase.rpc('get_dispute_details', {
    p_dispute_id: disputeId,
  })
  if (error) throw new Error(error.message)
  return data as DisputeDetails
}

export const getDisputeMessages = async (
  disputeId: string,
  limit = 50,
  offset = 0,
): Promise<DisputeMessagesResponse> => {
  const { data, error } = await supabase.rpc('get_dispute_messages', {
    p_dispute_id: disputeId,
    p_limit: limit,
    p_offset: offset,
  })
  if (error) throw new Error(error.message)
  return data as DisputeMessagesResponse
}

export const sendDisputeMessage = async (
  request: SendMessageRequest,
): Promise<{ message_id: string }> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session) throw new Error('User not authenticated')

  const { data, error } = await supabase.rpc('send_dispute_message', {
    p_dispute_id: request.dispute_id,
    p_sender_id: session.user.id,
    p_message_text: request.message_text,
  })
  if (error) throw new Error(error.message || 'Failed to send message')
  return data
}

export const getDisputeUnreadCount = async (
  disputeId: string,
  userId?: string,
): Promise<DisputeUnreadCount> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session) throw new Error('User not authenticated')

  const targetUserId = userId || session.user.id
  const { data, error } = await supabase.rpc('get_dispute_unread_count', {
    p_dispute_id: disputeId,
    p_user_id: targetUserId,
  })
  if (error) throw new Error(error.message)
  return data as DisputeUnreadCount
}

export const markDisputeAsRead = async (disputeId: string): Promise<void> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session) throw new Error('User not authenticated')

  const { error } = await supabase.rpc('mark_dispute_read', {
    p_dispute_id: disputeId,
    p_user_id: session.user.id,
  })
  if (error) throw new Error(error.message)
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
