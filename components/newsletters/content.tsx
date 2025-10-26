import { ContentsHeader } from "@/components/contents/contents-header";
import { ContentsCard } from "@/components/contents/contents-card";
import { getTranslations } from "next-intl/server";
import { getLatestNewsletters } from "@/data/newsletter";

export async function NewsLettersContents() {
  const t = await getTranslations("Contents");
  const newsletters = await getLatestNewsletters(3);

  const items = newsletters.map((newsletter) => ({
    title: `第${newsletter.issueNumber}号: ${newsletter.title}`,
    date: newsletter.publishedAt
      ? new Date(newsletter.publishedAt).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : new Date(newsletter.createdAt).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
  }));

  return (
    <div className="flex flex-col">
      <ContentsHeader title={t("newsletters")} />
      <div className="flex flex-col gap-[30px] mt-[60px]">
        {items.length === 0 ? (
          <p>ニュースレターはありません</p>
        ) : (
          items.map((item, index) => (
            <ContentsCard key={index} title={item.title} date={item.date} />
          ))
        )}
      </div>
    </div>
  );
}
