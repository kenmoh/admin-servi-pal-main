export type TransactionType =
  | "credit"
  | "debit"
  | "fund wallet"
  | "paid with wallet";
export type PaymentStatus =
  | "failed"
  | "paid"
  | "cancelled"
  | "pending"
  | "completed"
  | "successful";

export type PaymentMethod = "card" | "bank_transfer" | "wallet";

export interface TransactionSchema {
  id: string;
  wallet_id: string;
  amount: number;
  payment_by?: string;
  transaction_type: TransactionType;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_link: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionResponseSchema {
  /** Schema for transaction response with pagination */
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  transactions: TransactionSchema[];
}

export interface TransactionFilterSchema {
  /** Schema for filtering transactions */
  transaction_type?: TransactionType;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
}
