"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import * as jwt from 'jsonwebtoken';
import { usersUrl, authsUrl } from "@/lib/constant";
import {
  User,
  WalletSchema,
  ProfileSchema,
  RiderProfile,
} from "@/types/user-types";

export const getUsers = async (): Promise<User[] | { error: string }> => {
  try {
    const result = await fetch(`${usersUrl}`);
    return result.json();
  } catch (error) {
    return { error: error as string };
  }
};

export const getTeams = async (): Promise<User[] | { error: string }> => {
  try {
    const result = await fetch(`${usersUrl}/teams`);
    return result.json();
  } catch (error) {
    return { error: error as string };
  }
};

const loginSchema = z.object({
  username: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(1, "Password is required"),
});
const createStaffSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  phone_number: z.string().trim().min(1, "Phone number is required"),
  full_name: z.string().trim().min(1, "Full name is required"),
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

export const getUserIdFromToken = async (): Promise<string | null> => {
  try {
    const token = await getToken();
    if (!token?.value) {
      return null;
    }

    try {
      const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET || '');
      if (typeof decodedToken === 'string') {
        return null;
      }

      return decodedToken?.sub || null;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

interface AuthenticatedFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}

export async function authenticatedFetch(
  url: string,
  options: AuthenticatedFetchOptions = {}
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found. Please log in again.");
  }

  const { method = "GET", body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized. Please log in again.");
    }
    if (response.status === 403) {
      throw new Error(
        "Access forbidden. You do not have permission to perform this action."
      );
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

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

    const response = await fetch(`${authsUrl}/admin-login`, {
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
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      cookieStore.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 14,
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

export const getUserProfile = async (
  userId: string
): Promise<ProfileSchema | { error: string }> => {
  try {
    const result = await authenticatedFetch(`${usersUrl}/${userId}/profile`);

    // Check if the response is ok
    if (!result.ok) {
      return { error: `HTTP error! status: ${result.status}` };
    }

    const data = await result.json();
    return data;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const getUserProfileDetails = async (): Promise<
  User | { error: string }
> => {
  try {
    // Get the user ID from the token
    const userId = await getUserIdFromToken();

    if (!userId) {
      return { error: "No valid user ID found in token" };
    }

    // Get the token for authorization header
    const token = await getToken();

    const result = await authenticatedFetch(
      `${usersUrl}/${userId}/current-user-profile`
    );

    // Check if the response is ok
    if (!result.ok) {
      return { error: `HTTP error! status: ${result.status}` };
    }

    const data = await result.json();
    return data;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
export const getRiderProfileDetails = async (
  userId: string
): Promise<RiderProfile | { error: string }> => {
  try {
    const result = await authenticatedFetch(
      `${usersUrl}/${userId}/rider-profile`
    );

    // Check if the response is ok
    if (!result.ok) {
      return { error: `HTTP error! status: ${result.status}` };
    }

    const data = await result.json();
    return data;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const getWallets = async (): Promise<
  WalletSchema[] | { error: string }
> => {
  try {
    const result = await authenticatedFetch(`${usersUrl}/wallets`);
    const data = await result.json();

    return data;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

interface BlockUser {
  is_blocked: boolean;
}

export const toggleBlockUser = async (
  userId: string
): Promise<BlockUser | { error: string }> => {
  try {
    const result = await authenticatedFetch(
      `${usersUrl}/${userId}/toggle-block`,
      {
        method: "PUT",
      }
    );
    const data = await result.json();
    return data;
  } catch (error) {
    return { error: error as string };
  }
};

export const createStaff = async (
  staffData: z.infer<typeof createStaffSchema>
): Promise<{ success: boolean; message: string } | { error: string }> => {
  try {
    const result = await authenticatedFetch(`${authsUrl}/create-staff`, {
      method: "POST",
      body: staffData,
    });

    const data = await result.json();
    return {
      success: true,
      message: "Staff created successfully",
      ...data,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export async function logoutUser() {
  try {
    await authenticatedFetch(`${authsUrl}/logout`, { method: "POST" });
  } catch (error) {
    console.error("Logout failed", error);
    // Even if logout fails on the server, we still want to clear the cookies
    // and redirect the user to the login page.
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    redirect("/login");
  }
}
