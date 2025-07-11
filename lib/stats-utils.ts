import { StatsPeriod } from "@/types/stats-types";

// Utility Functions for Stats
export const formatStatsDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDateRange = (period: StatsPeriod): { start: string; end: string } => {
  const today = new Date();
  const endDate = formatStatsDate(today);
  let startDate: string;
  
  switch (period) {
    case StatsPeriod.LAST_7_DAYS:
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      startDate = formatStatsDate(sevenDaysAgo);
      break;
    case StatsPeriod.LAST_30_DAYS:
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 29);
      startDate = formatStatsDate(thirtyDaysAgo);
      break;
    case StatsPeriod.LAST_3_MONTHS:
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setDate(today.getDate() - 89);
      startDate = formatStatsDate(threeMonthsAgo);
      break;
    default:
      startDate = endDate;
  }
  
  return { start: startDate, end: endDate };
};

export const formatCurrency = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(num);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
