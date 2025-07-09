import { UserDataTable } from "@/components/user-data-table";
import { SectionCards, SectionCardConfig } from "@/components/section-cards";
import React from "react";
import { getUsers } from "@/actions/user";

const Page = async () => {
  const users = await getUsers();

  if ("error" in users) {
    return <div>Error: {users.error}</div>;
  }

  // Map users to expected shape for UserDataTable
  const tableUsers = users.map(user => ({
    ...user,
    is_blocked: user.is_blocked,
    // Convert string status to boolean: true if 'confirmed', false otherwise
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