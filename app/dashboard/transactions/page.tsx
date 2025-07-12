import { TransactionDataTable } from "@/components/transaction-data-table";
import { SectionCards } from "@/components/section-cards";
import { getOrders } from "@/actions/transaction";
import React from "react";

const Page = async () => {
  const transactionData = await getOrders();

  // Handle error case
  if ('error' in transactionData) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="p-4 text-red-500">
              Error loading transactions: {transactionData.error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-8">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <TransactionDataTable data={transactionData.transactions} />
        </div>
      </div>
    </div>
  );
};

export default Page;
