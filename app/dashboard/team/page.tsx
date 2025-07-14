"use client";

import { TeamDataTable } from "@/components/team-data-table";
import React from "react";
import { getTeams } from "@/actions/user";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="space-y-4 px-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-full" />
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  if (!teams || "error" in teams) {
    return <div>Error: {String(teams?.error || "Failed to load teams")}</div>;
  }

  if (!Array.isArray(teams)) {
    return <div>Error: Invalid data format</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <TeamDataTable data={teams} />
        </div>
      </div>
    </div>
  );
};

export default Page;