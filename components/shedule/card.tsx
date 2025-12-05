"use client";

export function ScheduleContentsCard({
  title,
  year,
  month,
  day,
  weekDay,
}: {
  title: string;
  year: string;
  month: string;
  day: string;
  weekDay: string;
}) {
  return (
    <div className="flex items-baseline gap-8 border-2 border-white p-4 md:p-6 rounded-[10px]">
      <div className="flex items-baseline gap-1 text-white">
        <p className="text-sm">{year}&nbsp;</p>
        <p className="text-lg font-bold">{month}.{day}</p>
        <p className="text-sm">({weekDay})</p>
      </div>
      <p className="font-bold text-white">{title}</p>
    </div>
  );
}
