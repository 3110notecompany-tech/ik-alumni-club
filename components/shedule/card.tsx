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
  imageUrl,
  linkUrl,
}: {
  title: string;
  date: string | number;
  imageUrl?: string | null;
  linkUrl?: string | null;
}) {
  const { month, day, weekDay } = formatCardDate(date);
  const t = useTranslations("Contents");

  return (
    <div className="flex w-full max-w-full sm:max-w-[342px] rounded-[25px] shadow-md overflow-hidden">
      <div className="bg-brand h-[150px] sm:h-[192px] w-[80px] sm:w-[100px] flex flex-col items-center pt-3 sm:pt-4">
        <div className="month-card-text text-lg sm:text-2xl">{month}</div>
        <div className="day-card-text text-2xl sm:text-[32px]">{day}</div>
        <div className="week-card-text text-[10px] sm:text-xs">[{weekDay}]</div>
      </div>
      <div className="bg-white h-[150px] sm:h-[192px] flex-1 sm:w-[242px] flex flex-col p-3 sm:p-4 gap-2 sm:gap-[10px]">
        <div className="calendar-card-title">{title}</div>
        <div className="flex justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={210}
              height={80}
              className="object-cover sm:h-[100px]"
            />
          ) : (
            <Image
              src="/components/shedule/Rectangle 5.svg"
              alt="Rectangle"
              width={210}
              height={80}
              className="sm:h-[100px]"
            />
          )}
        </div>
        {linkUrl ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-title hover:underline"
          >
            {t("click_here_for_details")}
          </a>
        ) : (
          <div className="link-title">{t("click_here_for_details")}</div>
        )}
      </div>
    </div>
  );
}
