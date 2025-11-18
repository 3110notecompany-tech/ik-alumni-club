import { setLocale } from "@/app/web/i18n/set-locale";
import { InformationList } from "@/components/information/list";
import { getInformations } from "@/data/information";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function InformationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getInformations();

  return (
    <div className="container mx-auto px-4 pt-10 pb-32">
      <h1 className="main-text mb-10">{t("information")}</h1>
      <InformationList items={items} />
    </div>
  );
}
