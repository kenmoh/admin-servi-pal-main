import { PaginationMeta } from "./commont-types";

export interface AuditLogEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  change_amount: string | null;
  actor_id: string | null;
  actor_type: string;
  notes: string | null;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface AuditLogListResponse {
  data: AuditLogEntry[];
  meta: PaginationMeta;
}

export interface AuditLogFilters {
  entity_type?: string;
  entity_id?: string;
  action?: string;
  actor_id?: string;
  date_from?: string;
  date_to?: string;
}
