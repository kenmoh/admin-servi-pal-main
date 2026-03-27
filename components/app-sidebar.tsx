"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, Wallet, ChartBarIcon, UsersIcon, Settings2Icon, CircleHelpIcon, SearchIcon, Bike, ForkKnife, WashingMachine, StoreIcon, ShieldAlertIcon, ScrollTextIcon, MailIcon } from "lucide-react"
import Image from "next/image"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
      title: "Users",
      url: "/admin/user",
      icon: <UsersIcon />,
    },
    {
      title: "Wallets",
      url: "/admin/wallets",
      icon: <Wallet />,
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/admin/dashboard">
                <Image src="/mainicon.png" alt="ServiPal" width={28} height={28} className="rounded-md" />
                <span className="text-base font-semibold">ServiPal</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.orders} />
        <NavDocuments items={data.disputes} label="Disputes" />
        <NavDocuments items={data.logs} label="Logs" />
        <NavDocuments items={data.contacts} label="Support" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
