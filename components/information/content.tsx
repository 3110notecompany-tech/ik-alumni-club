import { Contents } from "@/components/contents/content";
import { getTranslations } from "next-intl/server";
import { getInformations } from "@/data/information";

export async function InformationContents() {
  const t = await getTranslations("Contents");
  const informations = await getInformations();

  // 最新3件のお知らせを取得
  const items = informations.slice(0, 3).map((info) => ({
    title: info.title,
    date: info.date,
  }));

  return <Contents title={t("information")} items={items} />;
}
