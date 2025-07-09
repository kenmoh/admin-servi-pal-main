"use server";

import { ordersUrl } from "@/lib/constant";
import { DeliveryDetail } from "@/types/order-types";

export const getOrders = async (): Promise<
  DeliveryDetail[] | { error: string }
> => {
  try {
    const result = await fetch(`${ordersUrl}`);
    return result.json();
    console.log(result.json())
  } catch (error) {
    return { error: error as string };
  }
};
