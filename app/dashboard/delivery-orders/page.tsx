import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import React from "react";
import { getOrders } from "@/actions/order";
import {calculateOrderStats} from '@/lib/utils'


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
