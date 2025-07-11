import { OperationalEfficiencyDashboard } from "@/components/operational-efficiency-dashboard";
import { getComprehensiveStats } from "@/actions/stats";

export default async function OperationalAnalyticsPage() {
  const comprehensiveStatsResult = await getComprehensiveStats();
  const comprehensiveStats = "error" in comprehensiveStatsResult ? null : comprehensiveStatsResult;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Operational Analytics</h1>
              <p className="text-muted-foreground">
                Order processing, delivery performance, and operational efficiency metrics
              </p>
            </div>
          </div>
          
          <div className="px-4 lg:px-6">
            <OperationalEfficiencyDashboard comprehensiveStats={comprehensiveStats} />
          </div>
        </div>
      </div>
    </div>
  );
}
