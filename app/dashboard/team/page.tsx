
import { TeamDataTable } from "@/components/team-data-table";
import { SectionCards, SectionCardConfig } from "@/components/section-cards";
import React from "react";
import { getTeams, getUsers } from "@/actions/user";

const Page = async () => {
  const teams = await getTeams();

  if ("error" in teams) {
    return <div>Error: {teams.error}</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/*<SectionCards cards={userCards} />*/}
          <TeamDataTable
            data={teams}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;