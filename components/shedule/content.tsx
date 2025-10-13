import { ContentsHeader } from "../contents/contents-header";
import { ScheduleContentsCard } from "./card";

export function ScheduleContents() {
  const items = [{ title: "柏まつり", date: "2025/10/15" }];

  return (
    <div className="flex flex-col">
      <ContentsHeader title="SCHEDULE" />
      <div className="flex flex-col gap-[30px] mt-[60px]">
        {items.map((item, index) => (
          <ScheduleContentsCard
            key={index}
            title={item.title}
            date={item.date}
          />
        ))}
      </div>
    </div>
  );
}
