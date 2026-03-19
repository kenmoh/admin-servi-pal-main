'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { useAppContext } from "@/lib/context"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/tables/data-table'
import { userColumns } from '@/components/tables/user-columns'
import { ProfileDetail, ProfileListResponse, ProfileSummary } from '@/types/user-types'
import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserDetailDrawer } from '@/components/drawers/user-detail-drawer'
import { CreateAdminUserModal } from '@/components/modals/create-admin-user-modal'

const USER_TYPES = ['CUSTOMER', 'ADMIN', 'MODERATOR', 'SUPER_ADMIN']
const ACCOUNT_STATUSES = ['PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED']

const UserPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [userType, setUserType] = useState("")
  const [accountStatus, setAccountStatus] = useState("")
  const [page, setPage] = useState(1)
  const { setSelectedProfile } = useAppContext()

  const { data, isLoading } = useQuery<ProfileListResponse>({
    queryKey: ['users', page],
    queryFn: () => fetchApi(`/api/users?page=${page}&limit=10`),
  })

  const users = (data?.data ?? []).filter((u) => {
    const matchesSearch = !searchTerm ||
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone_number.includes(searchTerm)
    const matchesType = !userType || u.user_type === userType
    const matchesStatus = !accountStatus || u.account_status === accountStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const meta = data?.meta
  const hasFilters = searchTerm || userType || accountStatus

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="User Management" />

        <div className="space-y-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Manage and monitor all platform users.</p>
            <CreateAdminUserModal />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or phone..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={accountStatus} onValueChange={setAccountStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(""); setUserType(""); setAccountStatus("") }}>
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading users...</div>
          ) : (
            <>
              <DataTable
                columns={userColumns}
                data={users}
                onRowClick={(user: ProfileDetail) => setSelectedProfile(user)}
              />

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

              <UserDetailDrawer />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default UserPage
