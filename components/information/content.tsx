import { ContentsHeader } from "@/components/contents/contents-header";
import { ContentsCard } from "@/components/contents/contents-card";
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

  return (
    <div className="flex flex-col">
      <ContentsHeader title={t("information")} />
      <div className="flex flex-col gap-[30px] mt-[60px]">
        {items.length === 0 ? (
          <p>お知らせはありません</p>
        ) : (
          items.map((item, index) => (
            <ContentsCard key={index} title={item.title} date={item.date} />
          ))
        )}
      </div>
    </div>
  );
}
