import { Contents } from "@/components/contents/content";
import { useTranslations } from "next-intl";

export function NewsLettersContents() {
  const t = useTranslations("Contents");

  return (
    <Contents
      title={t("newsletters")}
      items={[{ title: "次回のイベント案内", date: "2025/10/15" }]}
    />
  );
}
