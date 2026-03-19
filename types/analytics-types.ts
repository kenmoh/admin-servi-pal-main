// ──────────────────────────────────────────────────────────────
// 1. Dashboard Overview
// ──────────────────────────────────────────────────────────────
export interface UserOverview {
  total: number
  customers: number
  riders: number
  dispatchers: number
  restaurant_vendors: number
  laundry_vendors: number
  blocked: number
  active: number
  new_7d: number
  new_30d: number
}

export interface OrderTypeStats {
  total: number
  completed: number
  cancelled: number
  disputed: number
  orders_7d: number
  orders_30d: number
  completion_rate: number
}

export interface DeliveryOrderStats extends OrderTypeStats {
  pending: number
  active: number
}

export interface OrderTotals {
  all_orders: number
  all_completed: number
  all_cancelled: number
  all_disputed: number
  orders_7d: number
  orders_30d: number
}

export interface OrderOverview {
  delivery: DeliveryOrderStats
  food: OrderTypeStats
  laundry: OrderTypeStats
  product: OrderTypeStats
  totals: OrderTotals
}

export interface RevenueOverview {
  total: number
  delivery: number
  food: number
  laundry: number
  product: number
  revenue_7d: number
  revenue_30d: number
}

export interface WalletOverview {
  total_balance: number
  total_escrow: number
  total_wallets: number
}

export interface TransactionOverview {
  total_volume: number
  volume_7d: number
  volume_30d: number
  total_count: number
  count_30d: number
}

export interface ReviewOverview {
  total: number
  avg_rating: number
  five_star: number
  four_plus_star: number
  five_star_pct: number
}

export interface DashboardOverviewResponse {
  users: UserOverview
  orders: OrderOverview
  revenue: RevenueOverview
  wallets: WalletOverview
  transactions: TransactionOverview
  reviews: ReviewOverview
}

// ──────────────────────────────────────────────────────────────
// 2. Order Trends
// ──────────────────────────────────────────────────────────────
export interface OrderTrendPoint {
  period: string           // 'YYYY-MM-DD'
  delivery_orders: number
  delivery_revenue: number
  food_orders: number
  food_revenue: number
  laundry_orders: number
  laundry_revenue: number
  product_orders: number
  product_revenue: number
  total_orders: number
  total_revenue: number
}

// ──────────────────────────────────────────────────────────────
// 3. User Growth
// ──────────────────────────────────────────────────────────────
export interface UserGrowthPoint {
  period: string
  customers: number
  riders: number
  dispatchers: number
  restaurant_vendors: number
  laundry_vendors: number
  total: number
}

// ──────────────────────────────────────────────────────────────
// 4. Status Breakdown
// ──────────────────────────────────────────────────────────────
export interface StatusBucket {
  status: string
  count: number
  percentage: number
}

export interface StatusBreakdownResponse {
  delivery: StatusBucket[]
  delivery_payment: StatusBucket[]
  food: StatusBucket[]
  laundry: StatusBucket[]
  product: StatusBucket[]
}

// ──────────────────────────────────────────────────────────────
// 5. Top Riders
// ──────────────────────────────────────────────────────────────
export interface TopRider {
  id: string
  full_name: string | null
  phone_number: string | null
  profile_image_url: string | null
  bike_number: string | null
  average_rating: number
  review_count: number
  is_blocked: boolean
  is_online: boolean
  total_distance: number
  dispatcher_id: string | null
  dispatcher_business_name: string | null
  completed_deliveries: number
  cancelled_deliveries: number
  revenue_generated: number
  earnings: number
  cancel_rate: number
}

// ──────────────────────────────────────────────────────────────
// 6. Top Vendors
// ──────────────────────────────────────────────────────────────
export interface TopVendor {
  id: string
  name: string | null
  phone_number: string | null
  profile_image_url: string | null
  average_rating: number
  review_count: number
  is_blocked: boolean
  completed_orders: number
  cancelled_orders: number
  total_orders: number
  revenue: number
}

// ──────────────────────────────────────────────────────────────
// 7. Review Analytics
// ──────────────────────────────────────────────────────────────
export interface RatingDistribution {
  '5': number
  '4': number
  '3': number
  '2': number
  '1': number
}

export interface ReviewOverallStats {
  total: number
  avg_rating: number
  distribution: RatingDistribution
  five_star_pct: number
}

export interface ReviewByOrderType {
  order_type: string
  count: number
  avg_rating: number
}

export interface TopRatedProfile {
  id: string
  name: string | null
  profile_image_url: string | null
  user_type: string
  average_rating: number
  review_count: number
}

export interface ReviewAnalyticsResponse {
  overall: ReviewOverallStats
  by_order_type: ReviewByOrderType[]
  top_rated: TopRatedProfile[]
}

// ──────────────────────────────────────────────────────────────
// 8. Transaction Analytics
// ──────────────────────────────────────────────────────────────
export interface TxByType {
  type: string
  count: number
  volume: number
}

export interface TxByOrderType {
  order_type: string
  count: number
  volume: number
}

export interface TxTrendPoint {
  period: string
  count: number
  volume: number
}

export interface TransactionAnalyticsResponse {
  by_type: TxByType[]
  by_order_type: TxByOrderType[]
  trend: TxTrendPoint[]
}

// ──────────────────────────────────────────────────────────────
// Shared query param types (for your Next.js API routes)
// ──────────────────────────────────────────────────────────────
export type AnalyticsInterval = 'day' | 'week' | 'month'

export interface TrendParams {
  days?: number       // 0 = all time
  interval?: AnalyticsInterval
}

export interface LeaderboardParams {
  limit?: number
  days?: number
}

export type VendorOrderType = 'FOOD' | 'LAUNDRY' | 'PRODUCT'