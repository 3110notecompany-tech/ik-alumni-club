import { Contents } from "@/components/contents/content";
import { useTranslations } from "next-intl";

export function InformationContents() {
  const t = useTranslations("Contents");

  return (
    <Contents
      title={t("information")}
      items={[{ title: "次回のイベント案内", date: "2025/10/15" }]}
    />
  );
}
