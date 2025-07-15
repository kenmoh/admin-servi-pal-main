"use server";

import { ordersUrl } from "@/lib/constant";
import {
  DeliveryDetail,
  PaginatedDeliveryDetailResponse,
} from "@/types/order-types";

export const getOrders = async (): Promise<
  DeliveryDetail[] | { error: string }
> => {
  try {
    const result = await fetch(`${ordersUrl}`);
    return result.json();
  } catch (error) {
    return { error: error as string };
  }
};


export const getPickupOrders = async (
  skip: number = 0,
  limit: number = 20
): Promise<PaginatedDeliveryDetailResponse | { error: string }> => {
  try {
    const url = new URL(`${ordersUrl}/pickup-orders`);
    url.searchParams.append("skip", skip.toString());
    url.searchParams.append("limit", limit.toString());
    const result = await fetch(url.toString());
    return result.json();
  } catch (error) {
    return { error: error as string };
  }
};

export const getRequireDeliveryOrders = async (
  skip: number = 0,
  limit: number = 20
): Promise<PaginatedDeliveryDetailResponse | { error: string }> => {
  try {
    const url = new URL(`${ordersUrl}/delivery-orders`);
    url.searchParams.append("skip", skip.toString());
    url.searchParams.append("limit", limit.toString());
    const result = await fetch(url.toString());
    return result.json();
  } catch (error) {
    return { error: error as string };
  }
};


