import { PaginationMeta } from "./commont-types";

/** Generic dictionary mapping */
type AnyDict = Record<string, any>;

// ── Enums ────────────────────────────────────────────────────────────────────

export type AccountStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";

export type UserType = "CUSTOMER" | "ADMIN" | "MODERATOR" | "SUPER_ADMIN";

// ── Base Schemas ─────────────────────────────────────────────────────────────

export interface ProfileBase {
  full_name: string | null;
  email: string | null;
  phone_number: string;
  user_type: UserType;
  account_status: AccountStatus;
  is_blocked: boolean;
  is_verified: boolean;
  state: string | null;
  profile_image_url: string | null;
}

// ── Request Schemas ──────────────────────────────────────────────────────────

export interface ManagementUserCreate {
  email: string;
  phone_number: string;
  full_name: string;
  /** Must be ADMIN or MODERATOR */
  user_type: "ADMIN" | "MODERATOR";
  password: string;
}

export interface BlockUserRequest {
  reason: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AuditLogFilters {
  entity_type: string | null;
  entity_id: string | null;
  action: string | null;
  actor_id: string | null;
  date_from: string | null;
  date_to: string | null;
}

export interface AuditLogCreate {
  entity_type: string;
  entity_id: string;
  action: string;
  old_value: AnyDict | null;
  new_value: AnyDict | null;
  change_amount: number | null;
  actor_id: string | null;
  actor_type: string;
  notes: string | null;
}

// ── Profile Schemas ──────────────────────────────────────────────────────────

export interface ProfileSummary {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string;
  user_type: UserType;
  account_status: AccountStatus;
  is_blocked: boolean;
  is_verified: boolean;
  is_online: boolean;
  average_rating: number;
  review_count: number;
  created_at: string;
}

export interface ProfileDetail extends ProfileSummary {
  business_name: string | null;
  store_name: string | null;
  business_address: string | null;
  state: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  account_holder_name: string | null;
  bike_number: string | null;
  dispatcher_id: string | null;
  has_delivery: boolean;
  total_delivery_count: number | null;
  daily_delivery_count: number;
  total_distance_travelled: number;
  order_cancel_count: number;
  delivery_order_cancel_count: number;
  suspension_end_date: string | null;
  last_seen_at: string | null;
  last_delivery_date: string | null;
  profile_image_url: string | null;
  backdrop_image_url: string | null;
  opening_hour: AnyDict | null;
  closing_hour: AnyDict | null;
  metadata: AnyDict | null;
  updated_at: string | null;
}



export interface ProfileListResponse {
  data: ProfileDetail[];
  meta: PaginationMeta;
}

// ── Audit Log Responses ──────────────────────────────────────────────────────

export interface AuditLogListResponse extends AuditLogCreate {
  id: string;
  created_at: string;
  ip_address: string;
  user_agent: string;
}

export interface AuditLogEntry extends AuditLogCreate {
  id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// ── Wallet & Transactions ────────────────────────────────────────────────────

export interface TransactionItem {
  id: string;
  tx_ref: string | null;
  wallet_id: string | null;
  amount: number;
  transaction_type: string;
  payment_status: string | null;
  payment_method: string | null;
  from_user_id: string | null;
  to_user_id: string | null;
  order_id: string | null;
  order_type: string | null;
  details: AnyDict;
  released_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface WalletSummary {
  id: string;
  user_id: string;
  balance: number;
  escrow_balance: number;
  created_at: string;
  updated_at: string | null;
}

export interface WalletWithTransactions extends WalletSummary {
  transactions: TransactionItem[];
}

export interface WalletListResponse {
  data: WalletWithTransactions[];
  meta: PaginationMeta;
}