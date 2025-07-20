import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { RevenueStatsTable } from "@/components/revenue-stats-table";
import { TopPerformers } from "@/components/top-performers";
import { UserEngagementDashboard } from "@/components/user-engagement-dashboard";
// import { useQuery } from "@tanstack/react-query";
import { OperationalEfficiencyDashboard } from "@/components/operational-efficiency-dashboard";
import { FinancialAnalyticsDashboard } from "@/components/financial-analytics-dashboard";

import {
  getOrderStats,
  getPlatformOverview,
  getRevenueStats,
  getUserStats,
  getComprehensiveStats
} from "@/actions/stats";
import { StatsPeriod } from "@/types/stats-types";
import {getActiveUserCount} from '@/actions/user'
import { formatCurrency, formatNumber } from "@/lib/stats-utils";

export default async function Page() {
  // Fetch all stats data
  const [
    orderStatsResult,
    platformOverviewResult,
    revenueStatsResult,
    userStatsResult,
    comprehensiveStatsResult
  ] = await Promise.all([
    getOrderStats(StatsPeriod.LAST_7_DAYS),
    getPlatformOverview(),
    getRevenueStats(StatsPeriod.LAST_7_DAYS),
    getUserStats(StatsPeriod.LAST_7_DAYS),
    getComprehensiveStats()
  ]);

  // Handle potential errors
  const orderStats = "error" in orderStatsResult ? null : orderStatsResult;
  const platformOverview = "error" in platformOverviewResult ? null : platformOverviewResult;
  const revenueStats = "error" in revenueStatsResult ? null : revenueStatsResult;
  const userStats = "error" in userStatsResult ? null : userStatsResult;
  const comprehensiveStats = "error" in comprehensiveStatsResult ? null : comprehensiveStatsResult;


  const data = await getActiveUserCount()
  console.log(data)



  // Prepare stats for section cards
  const statsCards = platformOverview ? [
    {
      title: "Total Orders",
      value: formatNumber(platformOverview.total_orders),
      description: "All time orders",
      footer: `${platformOverview.orders_today} orders today`,
    },
    {
      title: "Active Users",
      value: formatNumber(data?.count),
      description: "Users active today",
      footer: `${formatNumber(platformOverview.total_users)} total users`,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(platformOverview.total_revenue),
      description: "Platform revenue",
      footer: "All time earnings",
    },
    {
      title: "Pending Orders",
      value: formatNumber(platformOverview.pending_orders),
      description: "Orders in progress",
      footer: `${formatNumber(platformOverview.completed_orders)} completed`,
    },
  ] : undefined;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards cards={statsCards} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive orderStats={orderStats} />
          </div>

          {/* Enhanced User Engagement Dashboard */}
          <div className="px-4 lg:px-6">
            <UserEngagementDashboard userStats={userStats} />
          </div>

          {/* Enhanced Operational Efficiency Dashboard */}
         <div className="px-4 lg:px-6">
            <OperationalEfficiencyDashboard comprehensiveStats={comprehensiveStats} />
          </div>

          {/* Enhanced Financial Analytics Dashboard */}
         <div className="px-4 lg:px-6">
            <FinancialAnalyticsDashboard comprehensiveStats={comprehensiveStats} />
          </div>
          
          {/* Top Performers */}
          <div className="px-4 lg:px-6">
            <TopPerformers comprehensiveStats={comprehensiveStats} />
          </div>

          {/* Revenue Stats Table */}
          <div className="px-4 lg:px-6">
            <RevenueStatsTable revenueStats={revenueStats} />
          </div>

        </div>
      </div>
    </div>
  );
}
