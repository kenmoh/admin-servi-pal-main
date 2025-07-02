export type UserRole = 'admin' | 'customer' | 'restaurant' | 'laundry' | 'vendor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  escrowBalance: number;
  currency: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'credit' | 'debit' | 'escrow';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'delivery' | 'food' | 'laundry' | 'marketplace';
  vendorId: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'restaurant' | 'laundry' | 'marketplace';
  address: string;
  contact: string;
  rating: number;
  services: Service[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  totalUsers: number;
  totalVendors: number;
  totalTransactions: number;
  totalRevenue: number;
  activeServices: number;
  userStats: Record<UserRole, number>;
  revenueByCategory: Record<Service['category'], number>;
}
