import { getUpcomingSchedules } from "@/data/schedule";
import { format } from "date-fns";
import { ContentsHeader } from "../contents/contents-header";
import { ScheduleContentsCard } from "./card";

export async function ScheduleContents() {
  const schedules = await getUpcomingSchedules();
  const items = schedules.slice(0, 3).map((schedule) => ({
    title: schedule.title,
    date: format(new Date(schedule.eventDate), "yyyy/MM/dd HH:mm"),
  }));

  return (
    <div className="flex flex-col">
      <ContentsHeader title="SCHEDULE" />
      <div className="flex flex-col gap-[30px] mt-[60px]">
        {items.length === 0 ? (
          <p>予定されているイベントはありません</p>
        ) : (
          items.map((item, index) => (
            <ScheduleContentsCard
              key={index}
              title={item.title}
              date={item.date}
            />
          ))
        )}
      </div>
    </div>
  );
}
