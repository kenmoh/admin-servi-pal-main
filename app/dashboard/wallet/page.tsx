import React from "react";
import { getWallets } from "@/actions/user";
import { WalletDataTable } from "@/components/wallet-data-table";

const Page = async () => {
  const wallets = await getWallets();

  if ("error" in wallets) return <div>Error: {wallets.error}</div>;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <WalletDataTable data={wallets} />
        </div>
      </div>
    </div>
  );
};

export default Page;
