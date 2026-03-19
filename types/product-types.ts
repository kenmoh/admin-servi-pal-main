import { PaginationMeta } from "./commont-types";

export interface CustomerSnippet {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  profile_image_url: string | null;
}

export interface VendorSnippet {
  id: string;
  business_name: string | null;
  store_name: string | null;
  email: string | null;
  phone_number: string | null;
  profile_image_url: string | null;
}

export interface ProductOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  selected_size: any[] | null;
  selected_color: any[] | null;
  images: string[] | null;
  created_at: string;
}

export interface ProductOrderSummary {
  id: string;
  order_number: number | null;
  tx_ref: string | null;
  customer_id: string | null;
  vendor_id: string | null;
  grand_total: number;
  amount_due_vendor: number;
  order_status: string | null;
  payment_status: string | null;
  escrow_status: string | null;
  delivery_option: string | null;
  shipping_cost: number;
  order_type: string | null;
  has_dispute: boolean;
  has_review: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface ProductOrderDetail extends ProductOrderSummary {
  delivery_address: string | null;
  additional_info: string | null;
  cancel_reason: string | null;
  dispute_id: string | null;
  is_deleted: boolean;
  customer: CustomerSnippet | null;
  vendor: VendorSnippet | null;
  items: ProductOrderItem[];
}


export interface ProductOrderListResponse {
  data: ProductOrderSummary[];
  meta: PaginationMeta;
}


export interface ProductOrderFilters {
  order_status: string | null;
  payment_status: string | null;
  escrow_status: string | null;
  vendor_id: string | null;
  customer_id: string | null;
  has_dispute: boolean | null;
  date_from: string | null;
  date_to: string | null;
  search: string | null;
}