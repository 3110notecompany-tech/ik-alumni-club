import { getSchedules } from "@/data/schedule";
import { ContentsHeader } from "../contents/contents-header";
import { ScheduleContentsCard } from "./card";
import Link from "next/link";

export async function ScheduleContents() {
  const schedules = await getSchedules();
  const items = schedules.slice(0, 3);

  return (
    <div className="flex flex-col">
      <ContentsHeader title="SCHEDULE" viewAllHref="/schedule" />
      <div className="flex flex-col md:flex-row gap-[30px] mt-[60px]">
        {items.length === 0 ? (
          <p>予定されているイベントはありません</p>
        ) : (
          items.map((schedule) => {
            const dateObj = new Date(schedule.eventDate);
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
            const weekDay = weekDays[dateObj.getDay()];

            return (
              <Link key={schedule.id} href={`/schedule/${schedule.id}`}>
                <ScheduleContentsCard
                  title={schedule.title}
                  month={month}
                  day={day}
                  weekDay={weekDay}
                  imageUrl={schedule.imageUrl}
                  linkUrl={schedule.linkUrl}
                />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
