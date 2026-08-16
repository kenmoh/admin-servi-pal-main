"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TransactionListResponse } from "@/types/user-types";
import { DataTable } from "@/components/tables/data-table";
import { transactionColumns } from "@/components/tables/transaction-columns";

export default function UserTransactionsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<TransactionListResponse>({
    queryKey: ["user-transactions", userId, page],
    queryFn: async () => {
      const res = await fetch(
        `/api/users/${userId}/transactions?page=${page}&page_size=10`,
      );
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });

  const meta = data?.meta;
  const transactions = data?.data ?? [];

  return (
    <>
      <SiteHeader title="User Transactions" />

      <div className="space-y-6 px-6 py-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading transactions...
          </div>
        ) : (
          <>
            <DataTable columns={transactionColumns} data={transactions} />

            {meta && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.total_pages} &mdash;{" "}
                  {meta.total} total
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === meta.total_pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
