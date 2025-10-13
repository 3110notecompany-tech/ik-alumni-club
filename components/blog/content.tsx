import { Contents } from "@/components/contents/content";
import { useTranslations } from "next-intl";

export function BlogContents() {
  const t = useTranslations("Contents");

  return (
    <Contents
      title={t("blog")}
      items={[{ title: "次回のイベント案内", date: "2025/10/15" }]}
    />
  );
}
