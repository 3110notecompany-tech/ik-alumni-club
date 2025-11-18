import { setLocale } from "@/app/web/i18n/set-locale";
import { ScheduleList } from "@/components/shedule/list";
import { getSchedules } from "@/data/schedule";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getSchedules();

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32 px-4">
      <h1 className="main-text mb-10">{t("schedule")}</h1>
      <ScheduleList items={items} />
    </div>
  );
}
