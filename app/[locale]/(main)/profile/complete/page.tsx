import { setLocale } from "@/app/web/i18n/set-locale";
import { ProfileCompleteForm } from "@/components/profile/profile-complete-form";
import { getCurrentMember } from "@/actions/members/get-member";
import { redirect } from "next/navigation";

export default async function ProfileCompletePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  const memberResult = await getCurrentMember();

  if (!memberResult.success) {
    redirect("/mypage");
  }

  const member = memberResult.data;

  // すでにプロフィールが完成している場合はマイページにリダイレクト
  if (member.status === "active") {
    redirect("/mypage");
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">プロフィール情報の入力</h1>
        <p className="text-muted-foreground">
          会員限定コンテンツにアクセスするため、詳細な情報を入力してください。
        </p>
      </div>

      <ProfileCompleteForm member={member} />
    </div>
  );
}
