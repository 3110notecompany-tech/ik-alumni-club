import { setLocale } from "@/app/web/i18n/set-locale";
import { getTranslations } from "next-intl/server";
import { Contents } from "@/components/contents/content";
import { InformationContents } from "@/components/information/content";

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
        <div className="mb-32">
          <InformationContents />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-15">
          <Contents
            title="BLOG"
            items={[{ title: "次回のイベント案内", date: "2025/10/15" }]}
          />
          <Contents
            title="NEWSLETTERS"
            items={[{ title: "最新のお知らせ", date: "2025/10/12" }]}
          />
        </div>
      </main>
    </div>
  );
}
