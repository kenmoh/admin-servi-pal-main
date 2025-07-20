"use server";

import { itemUrl } from "@/lib/constant";
import { Menu } from "@/types/menu";

export const getFoodMenus = async (): Promise<Menu[]> => {
  try {
    const response = await fetch(`${itemUrl}/foods`);
    if (!response.ok) {
      throw new Error("Failed to fetch food menus");
    }
    const menus = await response.json();
    return menus;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getLaundryItems = async (): Promise<Menu[]> => {
  try {
    const response = await fetch(`${itemUrl}/laundries`);
    if (!response.ok) {
      throw new Error("Failed to fetch laundry items");
    }
    const items = await response.json();
    return items;
  } catch (error) {
    console.error(error);
    return [];
  }
};
