import { getAllSchedules } from "@/data/schedule";
import { ScheduleCard } from "@/components/schedule-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminSchedulesPage() {
  const schedules = await getAllSchedules();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">スケジュール管理</h1>
        <Button asChild>
          <Link href="/admin/schedules/new">新規作成</Link>
        </Button>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg mb-4">スケジュールがありません</h3>
          <Button asChild>
            <Link href="/admin/schedules/new">新規作成</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} showActions />
          ))}
        </div>
      )}
    </div>
  );
}
