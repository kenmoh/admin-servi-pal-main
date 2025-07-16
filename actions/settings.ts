"use server";

import { settingsUrl } from "@/lib/constant";
import { SettingsType } from "@/types/settings-types";
import { authenticatedFetch } from "./user";

export const getChargeCommission = async (): Promise<
  SettingsType | { error: string }
> => {
  try {
    const result = await authenticatedFetch(`${settingsUrl}/charge-commission`);

    if (!result.ok) {
      return { error: `HTTP error! status: ${result.status}` };
    }

    const data = await result.json();
    return data;
  } catch (error) {
    return { error: error as string };
  }
};

export const updateChargeCommission = async (
  settingsData: SettingsType
): Promise<SettingsType | { error: string }> => {
  try {
    const result = await authenticatedFetch(`${settingsUrl}/charge-commission`, {
      method: "PUT",
      body: settingsData,
    });

    if (!result.ok) {
      return { error: `HTTP error! status: ${result.status}` };
    }

    const data = await result.json();
    return data;
  } catch (error) {
    return { error: error as string };
  }
};
