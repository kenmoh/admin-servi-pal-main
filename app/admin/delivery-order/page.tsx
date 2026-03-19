'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { useAppContext } from "@/lib/context"
import { Button } from '@/components/ui/button'
import { DeliveryDetailDrawer } from '@/components/drawers/delivery-detail-drawer'
import { Input } from '@/components/ui/input'
import { deliveryColumns } from '@/components/tables/delivery-colums'
import { DataTable } from '@/components/tables/data-table'
import { DeliveryOrderListResponse, DeliveryOrderSummary } from '@/types/delivery-types'
import { useQuery } from '@tanstack/react-query'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const DELIVERY_STATUSES = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']

const deliveryOrder = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [disputeFilter, setDisputeFilter] = useState("")
  const [page, setPage] = useState(1)
  const { setSelectedDelivery } = useAppContext()

  const { data, isLoading } = useQuery<DeliveryOrderListResponse>({
    queryKey: ['deliveries', page],
    queryFn: async () => {
      const response = await fetch(`/api/deliveries?page=${page}&limit=10`)
      if (!response.ok) throw new Error('Failed to fetch')
      return response.json()
    },
  })

  const deliveries = (data?.data ?? []).filter((d) => {
    const matchesSearch = !searchTerm || 
      d.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(d.order_number).includes(searchTerm)
    const matchesStatus = !statusFilter || d.delivery_status === statusFilter
    const matchesDispute = !disputeFilter || String(d.has_dispute) === disputeFilter
    const matchesDateFrom = !dateFrom || new Date(d.created_at) >= new Date(dateFrom)
    const matchesDateTo = !dateTo || new Date(d.created_at) <= new Date(dateTo)
    return matchesSearch && matchesStatus && matchesDispute && matchesDateFrom && matchesDateTo
  })

  const meta = data?.meta
  const hasFilters = searchTerm || dateFrom || dateTo || statusFilter || disputeFilter

  const clearFilters = () => {
    setSearchTerm("")
    setDateFrom("")
    setDateTo("")
    setStatusFilter("")
    setDisputeFilter("")
  }

  const handleRowClick = (delivery: DeliveryOrderSummary) => {
    setSelectedDelivery(delivery)
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title='Delivery Management' />

        <div className="space-y-6 px-6">
          <div>
            <p className="text-muted-foreground">Track active and pending deliveries in real-time.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by package or order #..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Input
              type="date"
              className="w-40"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From"
            />
            <Input
              type="date"
              className="w-40"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {DELIVERY_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={disputeFilter} onValueChange={setDisputeFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Dispute" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Has Dispute</SelectItem>
                <SelectItem value="false">No Dispute</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          {/* Deliveries Table */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading deliveries...</div>
          ) : (
            <>
              <DataTable columns={deliveryColumns} data={deliveries} onRowClick={handleRowClick} />

              {/* Pagination */}
              {meta && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {meta.page} of {meta.total_pages} &mdash; {meta.total} total
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page === meta.total_pages}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              <DeliveryDetailDrawer />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default deliveryOrder