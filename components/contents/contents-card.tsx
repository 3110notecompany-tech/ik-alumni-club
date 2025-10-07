import { formatDate } from "@/lib/utils";

export function ContentsHeader({
  title,
  date,
}: {
  title: string;
  date: string | number;
}) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="date-text">{formatDate(date)}</div>
      <div className="contents-title">{title}</div>
    </div>
  );
}
