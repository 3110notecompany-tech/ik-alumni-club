import { setLocale } from "@/app/web/i18n/set-locale";
import { getTranslations } from "next-intl/server";
import { User } from "lucide-react";

export default async function ProfilesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");

  const members = [
    { id: "1", name: "山田 太郎", role: "代表" },
    { id: "2", name: "佐藤 花子", role: "副代表" },
    { id: "3", name: "鈴木 一郎", role: "事務局長" },
    { id: "4", name: "田中 美咲", role: "広報担当" },
    { id: "5", name: "高橋 健太", role: "会計担当" },
    { id: "6", name: "伊藤 裕子", role: "メンバー" },
  ];

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("profiles")}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="group flex flex-col items-center rounded-lg overflow-hidden border p-4 hover:shadow-lg transition-shadow bg-white"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 mb-3 flex items-center justify-center">
              <User className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
            </div>
            <h3 className="font-medium text-sm md:text-base text-center">
              {member.name}
            </h3>
            <span className="mt-1 text-xs text-gray-500">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
