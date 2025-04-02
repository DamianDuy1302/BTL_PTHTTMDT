"use client";
import {
  Box,
  Calendar,
  ChevronRight,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/stores/authStore";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Inbox,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: Box,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
];

export function AppSidebar(props: { isCollapsed: boolean }) {
  const { isCollapsed } = props;

  const router = useRouter();
  const pathname = usePathname();
  //@ts-ignore
  const { clearUserData } = useAuthStore();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-6">
            <div className="text-[14px] w-full">
              <span>Trang quản lý</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={
                    pathname === item.url
                      ? `bg-sidebar-accent text-sidebar-accent-foreground`
                      : ""
                  }
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Admin
                  {isCollapsed ? (
                    <ChevronRight className="ml-auto" />
                  ) : (
                    <ChevronUp className="ml-auto" />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isCollapsed ? "right" : "top"}
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  <span>E-com page</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    clearUserData();
                    router.push("/");
                  }}
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
