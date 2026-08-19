"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useAppContext } from "@/lib/context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ChartBarIcon, UsersIcon, Settings2Icon, CircleHelpIcon, SearchIcon, Bike, ForkKnife, WashingMachine, StoreIcon, ShieldAlertIcon, ScrollTextIcon, MailIcon, ActivityIcon, ShieldCheckIcon, HandCoins, ArrowLeftRightIcon, ReceiptText, Landmark, TrendingUpIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: <ChartBarIcon />,
    },
    {
      title: "Growth",
      url: "/admin/growth",
      icon: <TrendingUpIcon />,
    },
    {
      title: "Users",
      url: "/admin/user",
      icon: <UsersIcon />,
    },
  ],
 
  disputes: [
    {
      name: "Disputes",
      url: "/admin/disputes",
      icon: <ShieldAlertIcon />,
    },
  ],
  logs: [
    {
      name: "Audit Logs",
      url: "/admin/audit-logs",
      icon: <ScrollTextIcon />,
    },
  ],
  contacts: [
    {
      name: "Contacts",
      url: "/admin/contacts",
      icon: <MailIcon />,
    },
    {
      name: "Subscribers",
      url: "/admin/subscribers",
      icon: <UsersIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: (
        <Settings2Icon
        />
      ),
    },
   
  ],
  payouts: [
    {
      name: "Beneficiaries",
      url: "/admin/beneficiaries",
      icon: <HandCoins />,
    },
    {
      name: "Transfers",
      url: "/admin/transfers",
      icon: <ArrowLeftRightIcon />,
    },
    {
      name: "Platform Commission",
      url: "/admin/platform-commission",
      icon: <ReceiptText />,
    },
    {
      name: "Commission Withdrawals",
      url: "/admin/commission-withdrawals",
      icon: <Landmark />,
    },
  ],
  monitoring: [
    {
      name: "Payment Health",
      url: "/admin/payment-health",
      icon: <ActivityIcon />,
    },
    {
      name: "Payment Safety",
      url: "/admin/payment-safety",
      icon: <ShieldCheckIcon />,
    },
  ],
  orders: [
    {
      name: "Delivery Orders",
      url: "/admin/delivery-order",
      icon: <Bike />,
    },
    {
      name: "Restaurant Orders",
      url: "/admin/restaurant-order",
      icon: <ForkKnife />,
    },
    {
      name: "Laundry Orders",
      url: "/admin/laundry-order",
      icon: <WashingMachine />,
    },
    {
      name: "Marketplace Orders",
      url: "/admin/marketplace-order",
      icon: <StoreIcon />,
    },
  ],
  transactions: [
    {
      name: "Transactions",
      url: "/admin/transactions",
      icon: <ReceiptText />,
    },
    {
      name: "Flutterwave Transactions",
      url: "/admin/flutterwave-transactions",
      icon: <Landmark />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentUser } = useAppContext()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/admin/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Image src="/mainicon.png" alt="ServiPal" width={20} height={20} className="rounded-md" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ServiPal</span>
                  <span className="truncate text-xs text-muted-foreground">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.orders} />
        <NavDocuments items={data.transactions} label="Transactions" />
        <NavDocuments items={data.disputes} label="Disputes" />
        <NavDocuments items={data.logs} label="Logs" />
        <NavDocuments items={data.contacts} label="Support" />
        <NavDocuments items={data.payouts} label="Payouts" />
        <NavDocuments items={data.monitoring} label="Monitoring" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {currentUser && (
          <NavUser user={{
            name: currentUser.full_name || currentUser.name || currentUser.email || "Admin",
            email: currentUser.email,
            avatar: currentUser.profile_image_url || currentUser.avatar || '',
          }} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
