import { UserCard } from "@/components/user-card";
import { ProfileCompletionBanner } from "@/components/profile-completion-banner";
import { verifySession } from "@/lib/session";
import { getCurrentMember } from "@/actions/members/get-member";
import { setLocale } from "@/app/web/i18n/set-locale";

export default async function MypagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const session = await verifySession();

  // member情報を取得
  const memberResult = await getCurrentMember();
  const member = memberResult.success ? memberResult.data : null;

  return (
    <div className="container py-4 md:py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">マイページ</h1>

      {/* プロフィール未完成の場合は促進バナーを表示 */}
      {member && member.status === "pending_profile" && (
        <ProfileCompletionBanner />
      )}

      <UserCard user={session.user} />
    </div>
  );
}