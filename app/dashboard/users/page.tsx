import { UserDataTable } from "@/components/user-table";
import { SectionCards } from "@/components/section-cards";
import React from "react";
import { getUsers } from "@/actions/user";

const Page = async() => {
  const users = await getUsers()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <UserDataTable data={users} />
        </div>
      </div>
    </div>
  );
};

export default Page;
