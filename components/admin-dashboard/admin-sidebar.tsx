"use client";

import {
  LayoutDashboard,
  Users,
  Bell,
  Calendar,
  Video,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

const menuItems = [
  {
    title: "ダッシュボード",
    icon: LayoutDashboard,
    url: "/admin/dashboard",
  },
  {
    title: "会員管理",
    icon: Users,
    url: "#",
  },
  {
    title: "お知らせ管理",
    icon: Bell,
    url: "/admin/informations",
  },
  {
    title: "スケジュール管理",
    icon: Calendar,
    url: "/admin/schedules",
  },
  {
    title: "動画管理",
    icon: Video,
    url: "/admin/videos",
  },
  {
    title: "設定",
    icon: Settings,
    url: "#",
  },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2 py-2">
          <h2 className="text-lg font-semibold">管理者メニュー</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
