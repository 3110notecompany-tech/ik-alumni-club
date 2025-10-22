import { Contents } from "@/components/contents/content";
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

  return <Contents title={t("newsletters")} items={items} />;
}
