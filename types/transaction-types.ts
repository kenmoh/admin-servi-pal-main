export type TransactionType = string;
export type PaymentStatus = string;

export type OrderType =
  | "FOOD"
  | "LAUNDRY"
  | "PRODUCT"
  | "DELIVERY"
  | "DELIVERY_ORDER"
  | "DELIVERY_PAYOUT"
  | "ESCROW_AGREEMENT"
  | "ESCROW_RELEASE"
  | "WALLET_WITHDRAWAL"
  | "RESERVATION";

export interface Transaction {
  id: string; // uuid
  tx_ref: string | null;
  wallet_id: string | null; // uuid
  amount: string | null; // numeric — decimal string to avoid precision loss
  transaction_type: TransactionType;
  payment_status: PaymentStatus | null;
  payment_method: string | null;
  created_at: string | null; // timestamptz
  updated_at: string | null; // timestamptz
  from_user_id: string | null; // uuid
  to_user_id: string | null; // uuid
  order_id: string | null; // uuid
  details: Record<string, unknown> | null;
  order_type: OrderType | null;
  released_at: string | null; // timestamptz
}

export interface PageInfo {
  total: number;
  current_page: number;
  total_pages: number;
  page_size: number;
}

export interface TransactionListParams {
  page?: number;
  page_size?: number;
  payment_status?: PaymentStatus;
  transaction_type?: TransactionType;
  order_type?: OrderType;
  wallet_id?: string;
  from_user_id?: string;
  to_user_id?: string;
  order_id?: string;
  tx_ref?: string;
  start_date?: string; // ISO 8601
  end_date?: string; // ISO 8601
  sort_by?: "created_at" | "updated_at" | "amount";
  sort_order?: "asc" | "desc";
}

export interface TransactionListResponse {
  status: "success";
  message: string;
  meta: PageInfo;
  data: Transaction[];
}

export interface Card {
  first_6digits: string;
  last_4digits: string;
  issuer: string | null;
  country: string | null;
  type: string;
  token: string;
  expiry: string;
}

export interface Customer {
  id: number;
  name: string;
  phone_number: string | null;
  email: string;
  created_at: string; // ISO 8601 datetime
}

export interface TransactionData {
  id: number;
  tx_ref: string;
  flw_ref: string;
  device_fingerprint: string | null;
  amount: string; // Decimal — string to avoid precision loss
  currency: string;
  charged_amount: string; // Decimal
  app_fee: string; // Decimal
  merchant_fee: string; // Decimal
  processor_response: string;
  auth_model: string | null;
  ip: string | null;
  narration: string | null;
  status: string;
  payment_type: string;
  created_at: string; // ISO 8601 datetime
  account_id: number;
  card: Card | null;
  meta: Record<string, unknown> | unknown[] | null;
  amount_settled: string | null; // Decimal
  customer: Customer;
}

export interface TransactionResponse {
  status: string;
  message: string;
  data: TransactionData;
}

export interface FlutterwaveAccount {
  nuban: string;
  bank: string;
}

export interface FlutterwaveTransactionListItem {
  id: string;
  tx_ref: string;
  flw_ref: string | null;
  device_fingerprint: string | null;
  amount: string; // Decimal
  currency: string;
  charged_amount: string; // Decimal
  app_fee: string | null; // Decimal
  merchant_fee: string | null; // Decimal
  processor_response: string | null;
  auth_model: string | null;
  ip: string | null;
  narration: string | null;
  status: string;
  payment_type: string;
  created_at: string; // ISO 8601 datetime
  amount_settled: string | null; // Decimal
  account: FlutterwaveAccount | null;
  customer_name: string | null;
  customer_email: string | null;
  account_id: string;
}

export interface FlutterwavePageInfo {
  total: number;
  current_page: number;
  total_pages: number;
}

export interface FlutterwaveTransactionListMeta {
  page_info: FlutterwavePageInfo;
}

export interface FlutterwaveTransactionListResponse {
  status: string;
  message: string;
  meta: FlutterwaveTransactionListMeta;
  data: FlutterwaveTransactionListItem[];
}

export interface FlutterwaveTransactionEvent {
  note: string;
  actor: string;
  object: string;
  action: string;
  context: string;
  created_at: string; // ISO 8601 datetime
}

export interface FlutterwaveTransactionEventsResponse {
  status: string;
  message: string;
  data: FlutterwaveTransactionEvent[];
}