'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React, { useState } from 'react'
import { useAppContext } from "@/lib/context"
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/tables/data-table'
import { transferColumns } from '@/components/tables/transfer-columns'
import { TransferData, TransferListResponse } from '@/types/beneficiary-types'
import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '@/lib/utils'
import { TransferDetailDrawer } from '@/components/drawers/transfer-detail-drawer'

const TransfersPage = () => {
  const [page, setPage] = useState(1)
  const { setSelectedTransfer } = useAppContext()

  const { data, isLoading } = useQuery<TransferListResponse>({
    queryKey: ['transfers', page],
    queryFn: () => fetchApi(`/api/payouts?page=${page}`),
  })

  const transfers = data?.data ?? []
  const pageInfo = data?.meta?.page_info

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Transfers" />

        <div className="space-y-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Monitor and manage Flutterwave transfers.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading transfers...</div>
          ) : (
            <>
              <DataTable
                columns={transferColumns}
                data={transfers}
                onRowClick={(transfer: TransferData) => setSelectedTransfer(transfer)}
              />

              {pageInfo && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {pageInfo.current_page} of {pageInfo.total_pages} &mdash; {pageInfo.total} total
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === pageInfo.total_pages}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              <TransferDetailDrawer />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default TransfersPage
