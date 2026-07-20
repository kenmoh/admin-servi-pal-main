'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React, { useState } from 'react'
import { useAppContext } from "@/lib/context"
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/tables/data-table'
import { beneficiaryColumns } from '@/components/tables/beneficiary-columns'
import { BeneficiaryData, BeneficiaryListResponse } from '@/types/beneficiary-types'
import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '@/lib/utils'
import { BeneficiaryDetailDrawer } from '@/components/drawers/beneficiary-detail-drawer'

const BeneficiariesPage = () => {
  const [page, setPage] = useState(1)
  const { setSelectedBeneficiary } = useAppContext()

  const { data, isLoading } = useQuery<BeneficiaryListResponse>({
    queryKey: ['beneficiaries', page],
    queryFn: () => fetchApi(`/api/beneficiaries?page=${page}`),
  })

  const beneficiaries = data?.data ?? []
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
        <SiteHeader title="Beneficiaries" />

        <div className="space-y-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Manage Flutterwave transfer beneficiaries.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading beneficiaries...</div>
          ) : (
            <>
              <DataTable
                columns={beneficiaryColumns}
                data={beneficiaries}
                onRowClick={(beneficiary: BeneficiaryData) => setSelectedBeneficiary(beneficiary)}
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

              <BeneficiaryDetailDrawer />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default BeneficiariesPage
