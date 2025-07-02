"use server";

import { ordersUrl } from "@/lib/constant";
import { DeliveryDetail } from "@/types/order-types";

export const getOrders = async (): Promise<
  DeliveryDetail[] | { error: string }
> => {
  try {
    const result = await fetch(ordersUrl);
    console.log(result);
    return result.json();
  } catch (error) {
    return { error: error as string };
  }
};
