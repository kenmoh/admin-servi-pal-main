"use client";

import { UserDataTable } from "@/components/user-data-table";
import React from "react";
import { getUsers } from "@/actions/user";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="space-y-4 px-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-full" />
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
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

  if (!users || "error" in users) {
    return <div>Error: {String(users?.error || "Failed to load users")}</div>;
  }

  if (!Array.isArray(users)) {
    return <div>Error: Invalid data format</div>;
  }

  // Map users to expected shape for UserDataTable
  const tableUsers = users.map(user => ({
    ...user,
    is_blocked: user.is_blocked,
    account_status: user.account_status === 'confirmed',
    profile: user.profile ?? {
      phone_number: '',
      business_name: '',
      business_address: '',
      business_registration_number: '',
      full_name: '',
      account_holder_name: '',
      bank_name: '',
      store_name: '',
      bank_account_number: '',
      bike_number: '',
    },
    order_cancel_count: String(user.order_cancel_count ?? 0),
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/*<SectionCards cards={userCards} />*/}
          <UserDataTable
            data={tableUsers}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;