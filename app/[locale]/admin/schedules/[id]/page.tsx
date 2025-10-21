import { getSchedule } from "@/data/schedule";
import { ScheduleForm } from "@/components/schedule-form";
import { notFound } from "next/navigation";

export default async function EditSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const schedule = await getSchedule(params.id);

  if (!schedule) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">スケジュール編集</h1>
      <ScheduleForm defaultValues={schedule} />
    </div>
  );
}
