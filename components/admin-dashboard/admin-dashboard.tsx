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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">管理者ダッシュボード</h1>

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
