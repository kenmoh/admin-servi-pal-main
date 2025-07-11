"use client"
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { User } from "@/types/user-types"

export function NavUser({
  user,
}: {
  user: User
}) {
  const { isMobile } = useSidebar()
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage 
              src={user?.profile?.profile_image_url || user?.profile?.backdrop_image_url} 
              alt={user?.email} 
            />
            <AvatarFallback className="rounded-lg">
              {user?.profile?.full_name?.charAt(0) || 
               user?.profile?.business_name?.charAt(0) || 
               user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user?.profile?.full_name || 
               user?.profile?.business_name || 
               user?.profile?.store_name || 
               'User'}
            </span>
            <span className="text-muted-foreground truncate text-xs">
              {user?.email}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}