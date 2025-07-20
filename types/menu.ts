export interface Menu {
  id: string;
  name: string;
  description: string;
  item_type: "food" | "laundry";
  price: string;
  user_id: string;
};