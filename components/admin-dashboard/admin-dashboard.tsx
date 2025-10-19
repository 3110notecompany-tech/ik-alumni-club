"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDashboardProps {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="p-6">
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
  );
}
