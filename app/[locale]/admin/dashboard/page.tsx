import { verifySession } from "@/lib/session";
import { setLocale } from "@/app/web/i18n/set-locale";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard/admin-dashboard";
import { isAdmin } from "@/data/member";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const session = await verifySession();

  // 管理者権限チェック
  const adminCheck = await isAdmin();

  if (!adminCheck) {
    redirect("/");
  }

  return <AdminDashboard user={session.user} />;
}
