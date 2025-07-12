"use server";

import { paymentUrl } from "@/lib/constant";
import { TransactionResponseSchema } from "@/types/transaction-types";

export const getOrders = async (): Promise<
  TransactionResponseSchema | { error: string }
> => {
  try {
    const result = await fetch(`${paymentUrl}/all-transactions`);

    if (!result.ok) {
      return { error: `HTTP error! status: ${result.status}` };
    }

    const data = await result.json();
    return data;
  } catch (error) {
    return { error: error as string };
  }
};
