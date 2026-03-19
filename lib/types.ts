// User and Role types
export type UserRole = "super_admin" | "service_manager" | "vendor" | "support_staff"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  address?: string
  createdAt: Date
  status: "active" | "inactive" | "suspended" | "blocked"
  isBlocked?: boolean
  isVerified?: boolean
  kycStatus?: "pending" | "verified" | "rejected"
  wallet?: Wallet
}

export interface Vendor {
  id: string
  userId: string
  businessName: string
  businessType: "delivery" | "food" | "laundry" | "marketplace"
  rating: number
  totalOrders: number
  revenue: number
  status: "active" | "inactive" | "suspended"
  description?: string
  image?: string
  location?: string
  email?: string
  phone?: string
  bankAccount?: string
  commissionRate?: number
  verificationStatus?: "pending" | "verified" | "rejected"
  joinedDate?: Date
  responseTime?: string
  cancellationRate?: number
  wallet?: Wallet
  isBlocked?: boolean
  accountHoldReason?: string
  accountHoldAmount?: number
  complianceScore?: number
  lastComplianceCheck?: Date
}

export interface Order {
  id: string
  vendorId: string
  userId: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  totalAmount: number
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
  estimatedDelivery?: Date
  notes?: string
  paymentMethod?: string
  paymentStatus?: "pending" | "completed" | "failed"
  discountAmount?: number
  taxAmount?: number
  shippingCost?: number
  userName?: string
  userPhone?: string
  userAddress?: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}



export interface FoodOrder extends Order {
  restaurantName: string
  restaurantImage: string
  cuisineType: string
  preparationTime: string
  isDelivery: boolean
}

export interface LaundryOrder extends Order {
  laundryName?: string
  serviceType?: "wash" | "dry_clean" | "ironing" | "premium"
  pickupDate?: Date
  deliveryDate?: Date
  itemCount?: number
  weight?: number
}

export interface Complaint {
  id: string
  userId: string
  orderId?: string
  subject: string
  description: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  assignedTo?: string
  createdAt: Date
  messages: ComplaintMessage[]
}

export interface ComplaintMessage {
  id: string
  complaintId: string
  userId: string
  userName: string
  message: string
  timestamp: Date
  attachments?: string[]
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "order" | "complaint" | "system" | "alert"
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  changes?: Record<string, any>
  timestamp: Date
  ipAddress?: string
}

export interface DashboardStats {
  totalUsers: number
  activeVendors: number
  totalOrders: number
  totalRevenue: number
  openComplaints: number
  activeDeliveries: number
}

export interface WalletTransaction {
  id: string
  walletId: string
  type: "credit" | "debit"
  amount: number
  description: string
  reason: "order_payment" | "refund" | "commission" | "payout" | "adjustment"
  balance: number
  timestamp: Date
}

export interface Wallet {
  id: string
  userId?: string
  vendorId?: string
  balance: number
  escrowBalance: number
  transactions: WalletTransaction[]
  lastUpdated: Date
}
