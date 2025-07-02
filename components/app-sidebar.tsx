"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Handshake,
  ListCheck,
  Utensils,
  WashingMachine,
  UsersRound,
  Wallet,
  SettingsIcon,
  LayoutDashboardIcon,
  DollarSign,
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: UsersRound,
    },

    {
      title: "Team",
      url: "/dashboard/team",
      icon: UsersRound,
    },
    {
      title: "Wallet",
      url: "/dashboard/wallet",
      icon: Wallet,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: DollarSign,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
  ],
  services: [
    {
      name: "Delivery Orders",
      url: "/dashboard/delivery-orders",
      icon: ListCheck,
    },
    {
      name: "Food Orders",
      url: "/dashboard/food-orders",
      icon: ListCheck,
    },
    {
      name: "Laundry Orders",
      url: "/dashboard/lundry-orders",
      icon: ListCheck,
    },
    {
      name: "Food",
      url: "/dashboard/food-items",
      icon: Utensils,
    },
    {
      name: "Laundry",
      url: "/dashboard/laundry-items",
      icon: WashingMachine,
    },
    {
      name: "P2P Marketplace",
      url: "/dashboard/maketplace-items",
      icon: Handshake,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.services} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
