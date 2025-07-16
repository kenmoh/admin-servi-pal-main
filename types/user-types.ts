export interface User {
  email: string;
  user_type: string;
  id: string;
  is_blocked: boolean;
  account_status: string;
  order_cancel_count: number;
  profile: {
    user_id: string;
    phone_number: string;
    bike_number: string;
    bank_account_number: string;
    bank_name: string;
    full_name: string;
    business_name: string;
    store_name: string;
    business_address: string;
    business_registration_number: string;
    closing_hours: string;
    opening_hours: string;
    account_holder_name: string;
    profile_image_url: string;
    backdrop_image_url: string;
  };
}

type PaymentStatus =
  | "failed"
  | "paid"
  | "cancelled"
  | "pending"
  | "completed"
  | "successful";

type TransactionType = "credit" | "debit" | "fund wallet" | "paid with wallet";
export type PaymentMethod = "card" | "bank_transfer" | "wallet";
// Transaction interface
export interface TransactionSchema {
  id: string;
  wallet_id: string;
  amount: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_by: string;
  payment_link?: string;
  transaction_type: TransactionType;
  created_at: Date;
}

interface WalletProfileData {
  full_name?: string;
  business_name?: string;
  phone_number: string;
}

// Wallet interface
export interface WalletSchema {
  id: string;
  balance: number;
  profile: WalletProfileData;
  escrow_balance: number;
  transactions: TransactionSchema[];
}

// Profile interface
export interface ProfileSchema {
  user_id?: string;
  phone_number?: string;
  bike_number?: string;
  bank_account_number?: string;
  bank_name?: string;
  full_name?: string;
  business_name?: string;
  store_name?: string;
  business_address?: string;
  business_registration_number?: string;
  closing_hours?: string;
  opening_hours?: string;
  account_holder_name?: string;
  profile_image_url?: string;
  backdrop_image_url?: string;
}

export interface UserProfileResponse {
  email: string;
  user_type: string;
  id: string;
  profile?: ProfileSchema;
}

export interface RiderProfile {
  profile_image_url: string;
  full_name: string;
  phone_number: string;
  bike_number: string;
  business_name: string;
  business_address: string;
}

export interface StaffCreate {
  email: string;
  phone_number: string;
  full_name: string;
  password: string;
}

export interface StaffResponse {
  email: string;
  user_type: string;
}
