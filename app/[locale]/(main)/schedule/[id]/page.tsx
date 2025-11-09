import { setLocale } from "@/app/web/i18n/set-locale";
import { ScheduleDetail } from "@/components/shedule/detail";
import { getSchedule } from "@/data/schedule";
import { notFound } from "next/navigation";

export default async function ScheduleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getSchedule(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <ScheduleDetail item={item} />
    </div>
  );
}
