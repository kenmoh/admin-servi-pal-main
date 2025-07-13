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
  Users,
  TrendingUp,
  BarChart3,
  Activity,
  BugIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query"
import { getUserProfileDetails } from "@/actions/user";
import { User } from "@/types/user-types";
import { usePathname } from "next/navigation";
import Link from "next/link";

const data = {
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
  analytics: [
    {
      name: "User Analytics",
      url: "/dashboard/user-analytics",
      icon: Users,
    },
    {
      name: "Operational Analytics",
      url: "/dashboard/operational-analytics",
      icon: Activity,
    },
  ],
  navIssues: [
    {
      name: "Issues",
      url: "/dashboard/issues",
      icon: BugIcon,
    },
  ],
  navSecondary: [
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
  ],
  services: [
    {
      name: "Orders",
      url: "/dashboard/orders",
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userProfile, setUserProfile] = React.useState<User | undefined>(undefined);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: getUserProfileDetails,
  });

  React.useEffect(() => {
    if (profile && !('error' in profile)) {
      setUserProfile(profile);
    }
  }, [profile]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                {/* <IconInnerShadowTop className="!size-5" /> */}
                <img
                  src="/mainicon.png"
                  alt="ServiPal Logo"
                  className="h-7 w-7"
                />
                <span className="text-base font-semibold">ServiPal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.services} />
        <NavDocuments items={data.analytics} title="Analytics" />
        <NavDocuments items={data.navSecondary} title="Platform Settings" />
        <NavDocuments items={data.navIssues} title="Issues" />
      </SidebarContent>
      <SidebarFooter>
        {userProfile && <NavUser user={userProfile} />}
      </SidebarFooter>
    </Sidebar>
  );
}