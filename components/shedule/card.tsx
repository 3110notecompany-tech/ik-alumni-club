import { useTranslations } from "next-intl";
import Image from "next/image";

function formatCardDate(date: string | number) {
  const dateObj = new Date(date);
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekDay = weekDays[dateObj.getDay()];

  return { month, day, weekDay };
}

export function ScheduleContentsCard({
  title,
  date,
}: {
  title: string;
  date: string | number;
}) {
  const { month, day, weekDay } = formatCardDate(date);
  const t = useTranslations("Contents");

  return (
    <div className="flex max-w-[342px] rounded-[25px] shadow-md overflow-hidden">
      <div className="bg-brand h-[192px] w-[100px] flex flex-col items-center pt-4">
        <div className="month-card-text">{month}</div>
        <div className="day-card-text">{day}</div>
        <div className="week-card-text">[{weekDay}]</div>
      </div>
      <div className="bg-white h-[192px] w-[242px] flex flex-col p-4 gap-[10px]">
        <div className="calendar-card-title">{title}</div>
        <div className="flex justify-center">
          <Image
            src="/components/shedule/Rectangle 5.svg"
            alt="Rectangle"
            width={210}
            height={100}
          />
        </div>
        <div className="link-title">{t("click_here_for_details")}</div>
      </div>
    </div>
  );
}
