"use server";

import { ordersUrl } from "@/lib/constant";
import { DeliveryDetail } from "@/types/order-types";

// /api/orders/paid-pending-deliveries

export const getOrders = async (): Promise<
  DeliveryDetail[] | { error: string }
> => {
  try {
    const result = await fetch(`${ordersUrl}/paid-pending-deliveries`);
    return result.json();
  } catch (error) {
    return { error: error as string };
  }
};
