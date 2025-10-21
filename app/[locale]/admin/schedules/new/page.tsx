import { ScheduleForm } from "@/components/schedule-form";

export default function NewSchedulePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">スケジュール新規作成</h1>
      <ScheduleForm />
    </div>
  );
}
