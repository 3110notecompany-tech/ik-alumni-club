"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";

interface AdminDashboardProps {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">管理者ダッシュボード</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>ユーザー情報</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">名前: {user.name}</p>
                <p className="text-sm text-muted-foreground">メール: {user.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>会員管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">会員一覧の表示と管理</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>お知らせ管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">お知らせの作成と編集</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
