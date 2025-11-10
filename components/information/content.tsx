import { ContentsHeader } from "@/components/contents/contents-header";
import { ContentsCard } from "@/components/contents/contents-card";
import { getTranslations } from "next-intl/server";
import { getInformations } from "@/data/information";
import Link from "next/link";

export async function InformationContents() {
  const t = await getTranslations("Contents");
  const informations = await getInformations();

  // 最新3件のお知らせを取得
  const items = informations.slice(0, 3);

  return (
    <div className="flex flex-col">
      <ContentsHeader title={t("information")} viewAllHref="/information" />
      <div className="flex flex-col gap-[30px] mt-[60px]">
        {items.length === 0 ? (
          <p>お知らせはありません</p>
        ) : (
          items.map((item) => (
            <Link key={item.id} href={`/information/${item.id}`}>
              <ContentsCard title={item.title} date={item.date} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
