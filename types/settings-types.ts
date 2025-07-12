export interface SettingsType {
  payment_gate_way_fee: number;
  value_added_tax: number;
  payout_charge_transaction_upto_5000_naira: number;
  payout_charge_transaction_from_5001_to_50_000_naira: number;
  payout_charge_transaction_above_50_000_naira: number;
  stamp_duty: number;
  base_delivery_fee: number;
  delivery_fee_per_km: number;
  delivery_commission_percentage: number;
  food_laundry_commission_percentage: number;
  product_commission_percentage: number;
}
