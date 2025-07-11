"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { UserStatsResponse, StatsPeriod } from "@/types/stats-types"
import { formatNumber, calculatePercentageChange } from "@/lib/stats-utils"
import { Users, UserPlus, Activity, TrendingUp, TrendingDown } from "lucide-react"

interface UserEngagementDashboardProps {
  userStats?: UserStatsResponse | null
}

const chartConfig = {
  newUsers: {
    label: "New Users",
    color: "hsl(var(--chart-1))",
  },
  activeUsers: {
    label: "Active Users", 
    color: "hsl(var(--chart-2))",
  },
  totalUsers: {
    label: "Total Users",
    color: "hsl(var(--chart-3))",
  },
}

export function UserEngagementDashboard({ userStats }: UserEngagementDashboardProps) {
  if (!userStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Engagement Analytics</CardTitle>
          <CardDescription>User activity and growth metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">No user engagement data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { data, summary } = userStats
  
  // Calculate growth metrics
  const currentWeekData = data.slice(-7)
  const previousWeekData = data.slice(-14, -7)
  
  const currentWeekNewUsers = currentWeekData.reduce((sum, day) => sum + day.new_users, 0)
  const previousWeekNewUsers = previousWeekData.reduce((sum, day) => sum + day.new_users, 0)
  const newUsersGrowth = calculatePercentageChange(currentWeekNewUsers, previousWeekNewUsers)
  
  const currentWeekActiveUsers = Math.max(...currentWeekData.map(day => day.active_users))
  const previousWeekActiveUsers = Math.max(...previousWeekData.map(day => day.active_users))
  const activeUsersGrowth = calculatePercentageChange(currentWeekActiveUsers, previousWeekActiveUsers)

  // Activity heatmap data (mock data for hours - you'd get this from backend)
  const activityHeatmapData = [
    { hour: '00:00', activity: 12 },
    { hour: '03:00', activity: 8 },
    { hour: '06:00', activity: 25 },
    { hour: '09:00', activity: 45 },
    { hour: '12:00', activity: 62 },
    { hour: '15:00', activity: 55 },
    { hour: '18:00', activity: 78 },
    { hour: '21:00', activity: 40 },
  ]

  // User retention data (mock - you'd calculate this from backend)
  const retentionData = [
    { cohort: 'Week 1', retention: 100 },
    { cohort: 'Week 2', retention: 75 },
    { cohort: 'Week 3', retention: 60 },
    { cohort: 'Week 4', retention: 45 },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.total_new_users)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {newUsersGrowth > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={newUsersGrowth > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(newUsersGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.peak_active_users)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {activeUsersGrowth > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={activeUsersGrowth > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(activeUsersGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.final_total_users)}</div>
            <p className="text-xs text-muted-foreground">
              Cumulative user base
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Retention</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60%</div>
            <p className="text-xs text-muted-foreground">
              4-week retention rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="growth" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="growth">User Growth</TabsTrigger>
          <TabsTrigger value="activity">Activity Patterns</TabsTrigger>
          <TabsTrigger value="retention">Retention Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Trends</CardTitle>
              <CardDescription>Daily new users vs active users</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="new_users" 
                    stroke="var(--color-newUsers)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-newUsers)" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="active_users" 
                    stroke="var(--color-activeUsers)" 
                    strokeWidth={2}
                    dot={{ fill: "var(--color-activeUsers)" }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity Patterns</CardTitle>
              <CardDescription>User activity by time of day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={activityHeatmapData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="activity" fill="var(--color-activeUsers)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>User Retention Cohort</CardTitle>
              <CardDescription>Weekly retention rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retentionData.map((cohort, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium">{cohort.cohort}</div>
                    <div className="flex-1">
                      <Progress value={cohort.retention} className="h-2" />
                    </div>
                    <div className="w-12 text-sm text-muted-foreground">{cohort.retention}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
