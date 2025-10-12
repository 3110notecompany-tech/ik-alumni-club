import { setLocale } from "@/app/web/i18n/set-locale";
import { getTranslations } from "next-intl/server";
import { Contents } from "@/components/contents/content";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("HomePage");

  return (
    <div className="font-sans container max-w-full">
      <main>
        <Contents
          title="INFORMATION"
          items={[{ title: "次回のイベント案内", date: "2025/10/15" }]}
        />
      </main>
    </div>
  );
}
