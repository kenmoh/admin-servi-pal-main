import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import React from "react";
import data from "../data.json";
import { getOrders } from "@/actions/order";
import { DeliveryDetail } from "@/types/order-types";


export function calculateOrderStats(orders: OrderWithDelivery[]) {
  const stats = {
    totalPending: 0,
    pendingFood: 0,
    pendingPackage: 0,
    pendingLaundry: 0,
  };

  orders.forEach((order) => {
    if (order.delivery?.delivery_status === "pending") {
      stats.totalPending++;
      
      switch (order.delivery.delivery_type) {
        case "food":
          stats.pendingFood++;
          break;
        case "package":
          stats.pendingPackage++;
          break;
        case "laundry":
          stats.pendingLaundry++;
          break;
      }
    }
  });

  return stats;
}

const Page = async () => {
  const orders = await getOrders();
  const stats = calculateOrderStats(orders);



  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards stats={stats}/>
         <DataTable data={orders} />
        </div>
      </div>
    </div>
  );
};

export default Page;
