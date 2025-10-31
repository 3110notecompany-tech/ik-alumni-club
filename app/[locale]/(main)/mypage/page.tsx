import { UserCard } from "@/components/user-card";
import { verifySession } from "@/lib/session";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function MypagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const session = await verifySession();
  
    return (
    <div className="container">
      <h1 className="test-2xl font-bold">マイページ</h1>
      <UserCard user={session.user} />
    </div>
  );
}