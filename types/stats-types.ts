// Enums
export enum StatsPeriod {
  LAST_7_DAYS = "last_7_days",
  LAST_30_DAYS = "last_30_days",
  LAST_3_MONTHS = "last_3_months",
  CUSTOM = "custom",
}

// Order Stats Types
export interface OrderStatsDaily {
  date: string;
  package: number;
  food: number;
  laundry: number;
  total: number;
}

export interface OrderStatsResponse {
  period: StatsPeriod;
  start_date: string;
  end_date: string;
  data: OrderStatsDaily[];
  summary: {
    total_orders: number;
    package_orders: number;
    food_orders: number;
    laundry_orders: number;
  };
}

// Revenue Stats Types
export interface RevenueStatsDaily {
  date: string;
  total_revenue: string;
  order_revenue: string;
  delivery_revenue: string;
  transaction_count: number;
}

export interface RevenueStatsResponse {
  period: StatsPeriod;
  start_date: string;
  end_date: string;
  data: RevenueStatsDaily[];
  summary: {
    total_revenue: string;
    order_revenue: string;
    delivery_revenue: string;
    total_transactions: number;
  };
}

// User Stats Types
export interface UserStatsDaily {
  date: string;
  new_users: number;
  active_users: number;
  total_users: number;
}

export interface UserStatsResponse {
  period: StatsPeriod;
  start_date: string;
  end_date: string;
  data: UserStatsDaily[];
  summary: {
    total_new_users: number;
    peak_active_users: number;
    final_total_users: number;
  };
}

// Platform Overview
export interface PlatformOverview {
  total_users: number;
  total_vendors: number;
  total_customers: number;
  total_riders: number;
  total_orders: number;
  total_revenue: string;
  pending_orders: number;
  completed_orders: number;
  active_users_today: number;
  orders_today: number;
}

// Top Vendors/Customers
export interface TopVendorStat {
  vendor_id: string;
  vendor_name: string;
  vendor_email: string;
  total_orders: number;
  total_revenue: string;
  average_rating: number | null;
  review_count: number;
}

export interface TopCustomerStat {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  total_orders: number;
  total_spent: string;
  favorite_order_type: string | null;
}

// Distribution Stats
export interface OrderStatusStats {
  pending: number;
  delivered: number;
  received: number;
  rejected: number;
  cancelled: number;
  total: number;
}

export interface PaymentMethodStats {
  wallet: number;
  card: number;
  bank_transfer: number;
  total: number;
}

export interface DeliveryStats {
  total_deliveries: number;
  pending_deliveries: number;
  completed_deliveries: number;
  average_delivery_time: number | null;
  total_delivery_revenue: string;
}

export interface WalletStats {
  total_wallets: number;
  total_wallet_balance: string;
  total_escrow_balance: string;
  total_transactions: number;
  total_topups: number;
  total_withdrawals: number;
  topup_volume: string;
  withdrawal_volume: string;
}

// Comprehensive Stats Response
export interface ComprehensiveStatsResponse {
  platform_overview: PlatformOverview;
  order_status_distribution: OrderStatusStats;
  payment_method_distribution: PaymentMethodStats;
  delivery_stats: DeliveryStats;
  wallet_stats: WalletStats;
  top_vendors: TopVendorStat[];
  top_customers: TopCustomerStat[];
  generated_at: string;
}

// Generic Response Wrapper
export interface StatsResponseWrapper {
  success: boolean;
  message: string;
  data: any;
  generated_at: string;
}

// Available Periods
export interface AvailablePeriod {
  value: StatsPeriod;
  label: string;
  description: string;
}

export interface AvailablePeriodsResponse {
  periods: AvailablePeriod[];
}
