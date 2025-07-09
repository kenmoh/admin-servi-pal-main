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
