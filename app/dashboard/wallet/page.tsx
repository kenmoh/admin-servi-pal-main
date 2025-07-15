"use client";

import React from "react";
import { getWallets } from "@/actions/user";
import { WalletDataTable } from "@/components/wallet-data-table";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const { data: wallets, isLoading, error } = useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="space-y-4 px-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-full" />
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
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

  if (!wallets || "error" in wallets) {
    return <div>Error: {String(wallets?.error || "Failed to load wallets")}</div>;
  }

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
