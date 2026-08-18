export type ServiceType = "DELIVERY" | "FOOD" | "LAUNDRY" | "PRODUCT";
export type Period = "daily" | "weekly" | "monthly";
export type SortBy = "created_at" | "commission_amount" | "updated_at" | "service_type";
export type SortOrder = "asc" | "desc";

export interface CommissionListParams {
  service_type?: ServiceType;
  order_id?: string;
  from_user_id?: string;
  to_user_id?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: SortBy;
  sort_order?: SortOrder;
  page?: number;
  page_size?: number;
}

export interface CommissionTotalsParams {
  period?: Period;
  service_type?: ServiceType;
  start_date?: string;
  end_date?: string;
}

export interface CommissionOut {
  id: string;
  order_id?: string | null;
  from_user_id?: string | null;
  to_user_id?: string | null;
  service_type: string;
  commission_amount: string | number;
  description: string;
  created_at: string;
  updated_at?: string | null;
}

export interface PageInfo {
  total: number;
  current_page: number;
  total_pages: number;
  page_size: number;
}

export interface CommissionListResponse {
  meta: PageInfo;
  data: CommissionOut[];
}

export interface CommissionPeriodTotal {
  period_start: string;
  total_commission: string | number;
  transaction_count: number;
}

export interface CommissionTotalsResponse {
  period: Period;
  data: CommissionPeriodTotal[];
}

export interface CommissionSummary {
  total_commission: string | number;
  transaction_count: number;
}

// ── Commission Withdrawal Types ──────────────────────────────────────
export type WithdrawalStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface CommissionWithdrawalBalance {
  available_balance: string | number;
  total_withdrawn: string | number;
  total_commission: string | number;
}

export interface CommissionWithdrawalOut {
  id: string;
  amount: string | number;
  period_start: string | null;
  period_end: string | null;
  status: WithdrawalStatus;
  reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface CommissionWithdrawalListResponse {
  meta: PageInfo;
  data: CommissionWithdrawalOut[];
}

export interface CommissionWithdrawalCreate {
  amount: number;
  period_start?: string;
  period_end?: string;
  reference?: string;
  notes?: string;
}

export interface CommissionWithdrawalRecordResult {
  withdrawal_id: string;
  amount: string | number;
  commissions_linked: number;
}

export interface CommissionLedgerWeek {
  week_start: string;
  accrued: string | number;
  withdrawn: string | number;
  running_balance: string | number;
}