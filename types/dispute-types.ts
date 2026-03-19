import { PaginationMeta } from "./commont-types";

export interface DisputePartySnippet {
  id: string;
  full_name: string | null;
  business_name: string | null;
  store_name: string | null;
  profile_image_url: string | null;
  user_type: string | null;
}

export interface DisputeMessageItem {
  id: string;
  dispute_id: string;
  sender_id: string;
  message_text: string;
  attachments: string[] | null;
  is_read: boolean;
  created_at: string;
  sender: DisputePartySnippet | null;
}

export interface DisputeSummary {
  id: string;
  order_id: string;
  order_type: string | null;
  initiator_id: string;
  respondent_id: string;
  reason: string;
  status: string;
  last_message_text: string | null;
  last_message_at: string | null;
  unread_count: number;
  resolved_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface DisputeDetail extends DisputeSummary {
  resolution_notes: string | null;
  resolved_by_id: string | null;
  initiator: DisputePartySnippet | null;
  respondent: DisputePartySnippet | null;
  resolved_by: DisputePartySnippet | null;
  messages: DisputeMessageItem[];
}

export interface DisputeListResponse {
  data: DisputeSummary[];
  meta: PaginationMeta;
}

export interface AddDisputeMessageRequest {
  message_text: string;
  attachments?: string[];
}

export interface UpdateDisputeStatusRequest {
  status: string;
  resolution_notes?: string;
}
