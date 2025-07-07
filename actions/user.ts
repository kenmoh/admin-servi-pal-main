"use server";

import { usersUrl, authsUrl } from "@/lib/constant";
import { User } from "@/types/user-types";

export const getUsers = async (): Promise<User[] | { error: string }> => {
  try {
    const result = await fetch(`${usersUrl}`);
    return result.json();
  } catch (error) {
    return { error: error as string };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<{ token: string } | { error: string }> => {
  try {
    const response = await fetch(`${authsUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Login failed" };
    }
    const data = await response.json();
    return { token: data.token };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
};
