import { UserEngagementDashboard } from "@/components/user-engagement-dashboard";
import { getUserStats } from "@/actions/stats";
import { StatsPeriod } from "@/types/stats-types";

export default async function UserAnalyticsPage() {
  const userStatsResult = await getUserStats(StatsPeriod.LAST_7_DAYS);
  const userStats = "error" in userStatsResult ? null : userStatsResult;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">User Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive user engagement and behavior analytics
              </p>
            </div>
          </div>
          
          <div className="px-4 lg:px-6">
            <UserEngagementDashboard userStats={userStats} />
          </div>
        </div>
      </div>
    </div>
  );
}
