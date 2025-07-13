import { DeliveryDataTable } from "@/components/delivery-data-table";
import React from "react";
import { getOrders } from "@/actions/order";


const Page = async () => {
  const orders = await getOrders();

  if (!Array.isArray(orders)) {
    return <div>Error loading orders</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

          <DeliveryDataTable data={orders} />
        </div>
      </div>
    </div>
  );
};

export default Page;
