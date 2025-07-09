import { UserDataTable } from "@/components/user-data-table";
import { SectionCards, SectionCardConfig } from "@/components/section-cards";
import React from "react";
import { getUsers } from "@/actions/user";

const Page = async () => {
  const users = await getUsers();

  if ("error" in users) {
    return <div>Error: {users.error}</div>;
  }

  // Calculate user counts by type
  const userCounts = users.reduce((acc, user) => {
    acc.total++;
    acc[user.user_type] = (acc[user.user_type] || 0) + 1;
    return acc;
  }, {
    total: 0,
    restaurant_vendor: 0,
    laundry_vendor: 0,
    rider: 0,
  });

  // Prepare cards data
  const userCards: SectionCardConfig[] = [
    { 
      title: "Total Users", 
      value: userCounts.total, 
      description: "All registered users", 
      footer: `${userCounts.total} users in total` 
    },
    { 
      title: "Restaurant Vendors", 
      value: userCounts.restaurant_vendor, 
      description: "Restaurant Vendors", 
      footer: `${userCounts.restaurant_vendor} active restaurant vendors` 
    },
    { 
      title: "Laundry Vendors", 
      value: userCounts.laundry_vendor, 
      description: "Laundry vendors", 
      footer: `${userCounts.laundry_vendor} active laundry vendors` 
    },
    { 
      title: "Riders", 
      value: userCounts.rider, 
      description: "Delivery riders", 
      footer: `${userCounts.rider} active riders` 
    },
    
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/*<SectionCards cards={userCards} />*/}
          <UserDataTable 
            data={users} 
            initialFilters={[
              {
                id: "user_type",
                value: "all", // Default to show all users
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;