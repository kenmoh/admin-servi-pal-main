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


export interface FoodOrderItem {
  id: string;
  order_id: string;
  item_id: string;
  quantity: number;
  sizes: any[];
  sides: any[];
  images: any[] | null;
  created_at: string;
}

export interface FoodOrderSummary {
  id: string;
  order_number: number | null;
  tx_ref: string | null;
  customer_id: string | null;
  vendor_id: string | null;
  total_price: number;
  grand_total: number;
  amount_due_vendor: number;
  order_status: string | null;
  payment_status: string | null;
  require_delivery: boolean;
  has_dispute: boolean;
  has_review: boolean;
  delivery_fee: number;
  delivery_option: string | null;
  order_type: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface FoodOrderDetail extends FoodOrderSummary {
  pickup_location: string | null;
  destination: string | null;
  distance: number;
  vendor_pickup_dropoff_charge: number;
  cancel_reason: string | null;
  additional_info: string | null;
  dispute_id: string | null;
  is_deleted: boolean;
  customer: CustomerSnippet | null;
  vendor: VendorSnippet | null;
  items: FoodOrderItem[];
}


export interface FoodOrderListResponse {
  data: FoodOrderSummary[];
  meta: PaginationMeta;
}


export interface FoodOrderFilters {
  order_status: string | null;
  payment_status: string | null;
  vendor_id: string | null;
  customer_id: string | null;
  has_dispute: boolean | null;
  require_delivery: boolean | null;
  date_from: string | null;
  date_to: string | null;
  search: string | null;
}
