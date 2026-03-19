import { PaginationMeta } from "./commont-types";

export interface SenderSnippet {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  profile_image_url: string | null;
}

export interface RiderSnippet {
  id: string;
  dispatch_id: string;
  full_name: string | null;
  phone_number: string | null;
  bike_number: string | null;
  business_name: string
  profile_image_url: string | null;
}

export interface DispatchSnippet {
  id: string;
  business_name: string | null;
  phone_number: string | null;
  profile_image_url: string | null;
}


export interface DeliveryOrderSummary {
  id: string;
  order_number: number;
  tx_ref: string | null;
  sender_id: string;
  rider_id: string | null;
  dispatch_id: string | null;
  package_name: string;
  delivery_type: string;
  delivery_status: string;
  payment_status: string | null;
  escrow_status: string | null;
  delivery_fee: number;
  total_price: number;
  amount_due_dispatch: number;
  has_dispute: boolean;
  has_review: boolean;
  is_sender_cancelled: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface DeliveryOrderDetail extends DeliveryOrderSummary {
  receiver_phone: string;
  sender_phone_number: string | null;
  rider_phone_number: string | null;
  pickup_location: string;
  destination: string;
  distance: number;
  duration: string | null;
  description: string | null;
  additional_info: string | null;
  package_image_url: string | null;
  image_url: string | null;
  pickup_coordinates: [number, number];
  dropoff_coordinates: [number, number];
  last_known_rider_coordinates: [number, number];
  order_type: any | null;
  flw_ref: string | null;
  cancel_reason: string | null;
  cancelled_by: string | null;
  cancelled_at: string | null;
  dispute_id: string | null;
  is_deleted: boolean;
  sender: SenderSnippet | null;
  rider: RiderSnippet | null;
}


export interface DeliveryOrderListResponse {
  data: DeliveryOrderSummary[];
  meta: PaginationMeta;
}


export interface DeliveryOrderFilters {
  delivery_status: 'COMPLETED' | 'PENDING' | "CANCELLED" | "RETURNED" | "DECLINED" | "ASSIGNED" | "ACCEPTED" |"DELIVERED" | "IN_TRANSIT";
  payment_status: string | null;
  // escrow_status: string | null;
  delivery_type: string | null;
  rider_id: string | null;
  dispatch_id: string | null;
  sender_id: string | null;
  has_dispute: boolean | null;
  is_sender_cancelled: boolean | null;
  date_from: string | null;
  date_to: string | null;
  search: string | null;
}