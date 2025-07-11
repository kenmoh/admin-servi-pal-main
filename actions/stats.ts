"use server";

import { statsUrl } from "@/lib/constant";
import {
  OrderStatsResponse,
  RevenueStatsResponse,
  UserStatsResponse,
  PlatformOverview,
  ComprehensiveStatsResponse,
  StatsResponseWrapper,
  AvailablePeriodsResponse,
  StatsPeriod,
} from "@/types/stats-types";
import { authenticatedFetch } from "@/actions/user";

// Order Statistics
export const getOrderStats = async (
  period: StatsPeriod,
  customStart?: string,
  customEnd?: string
): Promise<OrderStatsResponse | { error: string }> => {
  try {
    let url = `${statsUrl}/orders?period=${period}`;
    
    if (period === StatsPeriod.CUSTOM && customStart && customEnd) {
      url += `&custom_start=${customStart}&custom_end=${customEnd}`;
    }
    
    const result = await authenticatedFetch(url);
    
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

// Revenue Statistics
export const getRevenueStats = async (
  period: StatsPeriod,
  customStart?: string,
  customEnd?: string
): Promise<RevenueStatsResponse | { error: string }> => {
  try {
    let url = `${statsUrl}/revenue?period=${period}`;
    
    if (period === StatsPeriod.CUSTOM && customStart && customEnd) {
      url += `&custom_start=${customStart}&custom_end=${customEnd}`;
    }
    
    const result = await authenticatedFetch(url);
    
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

// User Statistics
export const getUserStats = async (
  period: StatsPeriod,
  customStart?: string,
  customEnd?: string
): Promise<UserStatsResponse | { error: string }> => {
  try {
    let url = `${statsUrl}/users?period=${period}`;
    
    if (period === StatsPeriod.CUSTOM && customStart && customEnd) {
      url += `&custom_start=${customStart}&custom_end=${customEnd}`;
    }
    
    const result = await authenticatedFetch(url);
    
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

// Platform Overview
export const getPlatformOverview = async (): Promise<
  PlatformOverview | { error: string }
> => {
  try {
    const result = await authenticatedFetch(`${statsUrl}/overview`);
    
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

// Comprehensive Statistics
export const getComprehensiveStats = async (): Promise<
  ComprehensiveStatsResponse | { error: string }
> => {
  try {
    const result = await authenticatedFetch(`${statsUrl}/comprehensive`);
    
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

// Dashboard Statistics
export const getDashboardStats = async (
  period: StatsPeriod = StatsPeriod.LAST_7_DAYS
): Promise<StatsResponseWrapper | { error: string }> => {
  try {
    const result = await authenticatedFetch(`${statsUrl}/dashboard?period=${period}`);
    
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

// Quick Statistics
export const getQuickStats = async (): Promise<
  StatsResponseWrapper | { error: string }
> => {
  try {
    const result = await authenticatedFetch(`${statsUrl}/quick-stats`);
    
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

// Available Periods
export const getAvailablePeriods = async (): Promise<
  AvailablePeriodsResponse | { error: string }
> => {
  try {
    const result = await authenticatedFetch(`${statsUrl}/periods`);
    
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

// Health Check
export const getStatsHealthCheck = async (): Promise<
  { status: string; service: string; message: string; endpoints: string[] } | { error: string }
> => {
  try {
    const result = await authenticatedFetch(`${statsUrl}/health`);
    
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

