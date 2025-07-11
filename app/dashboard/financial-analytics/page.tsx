import { FinancialAnalyticsDashboard } from "@/components/financial-analytics-dashboard";
import { getComprehensiveStats, getRevenueStats } from "@/actions/stats";
import { StatsPeriod } from "@/types/stats-types";

export default async function FinancialAnalyticsPage() {
  const [comprehensiveStatsResult, revenueStatsResult] = await Promise.all([
    getComprehensiveStats(),
    getRevenueStats(StatsPeriod.LAST_7_DAYS)
  ]);
  
  const comprehensiveStats = "error" in comprehensiveStatsResult ? null : comprehensiveStatsResult;
  const revenueStats = "error" in revenueStatsResult ? null : revenueStatsResult;

  // Merge revenue stats into comprehensive stats for the component
  const enhancedComprehensiveStats = comprehensiveStats && revenueStats ? {
    ...comprehensiveStats,
    revenue_stats: revenueStats
  } : comprehensiveStats;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Financial Analytics</h1>
              <p className="text-muted-foreground">
                Revenue trends, wallet analytics, and financial performance metrics
              </p>
            </div>
          </div>
          
          <div className="px-4 lg:px-6">
            <FinancialAnalyticsDashboard comprehensiveStats={enhancedComprehensiveStats} />
          </div>
        </div>
      </div>
    </div>
  );
}
