"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { usersUrl, authsUrl } from "@/lib/constant";
import { User, WalletSchema, UserProfileResponse } from "@/types/user-types";

export const getUsers = async (): Promise<User[] | { error: string }> => {
  try {
    const result = await fetch(`${usersUrl}`);
    return result.json();
  } catch (error) {
    return { error: error as string };
  }
};

const loginSchema = z.object({
  username: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(1, "Password is required"),
});

export type FormState = {
  message: string;
  success: boolean;
  user_type?: string;
  errors?: string;
};

export const getToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  return token;
};

export async function loginUser(data: FormData) {
  const formData = Object.fromEntries(data);
  const parsedData = loginSchema.safeParse(formData);

  if (!parsedData.success) {
    // Validation Error
    return {
      message: "Missing field! Failed to login user",
      success: false,
      errors: parsedData.error.flatten().fieldErrors,
    };
  }
  try {
    const apiFormData = new FormData();
    apiFormData.append("username", parsedData.data.username);
    apiFormData.append("password", parsedData.data.password);

    const response = await fetch(`${authsUrl}/auth/login`, {
      method: "POST",
      body: apiFormData,
    });

    const data = await response.json();
    if (!response.ok) {
      // API returned an error
      return {
        success: false,
        message: data.message || "Invalid credentials",
      };
    }

    if (response.ok) {
      // Store the token in a cookie
      const cookieStore = await cookies();
      cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      cookieStore.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 14,
        path: "/",
      });

      cookieStore.set("allowed_routes", data.allowed_routes, {
        httpOnly: true,
        path: "/",
      });

      return {
        success: true,
        message: "Login Successful",
        user_type: data.user_type,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
  redirect("/dashboard");
}

export const getWallets = async (): Promise<
  WalletSchema[] | { error: string }
> => {
  try {
    const result = await fetch(`${usersUrl}/wallets`);
    
    // Check if the response is ok
    if (!result.ok) {
      return { error: `HTTP error! status: ${result.status}` };
    }
    
    const data = await result.json();
    console.log(data); // Log the parsed data instead
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};

export const getUserProfile = async (
  user_id: string
): Promise<UserProfileResponse | { error: string }> => {
  try {
    const result = await fetch(
      `${usersUrl.replace("/users", `/${user_id}/current-user-profile`)}`
    );
    return result.json();
  } catch (error) {
    return { error: error as string };
  }
};
