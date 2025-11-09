import { setLocale } from "@/app/web/i18n/set-locale";
import { NewsletterList } from "@/components/newsletters/list";
import { getPublishedNewsletters } from "@/data/newsletter";
import { getTranslations } from "next-intl/server";

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getPublishedNewsletters();

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <h1 className="main-text mb-10">{t("newsletter")}</h1>
      <NewsletterList items={items} />
    </div>
  );
}
