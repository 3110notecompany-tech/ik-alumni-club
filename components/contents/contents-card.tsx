import { formatDate } from "@/lib/utils";
import { Lock } from "lucide-react";

export function ContentsCard({
  title,
  date,
  isMemberOnly = false,
}: {
  title: string;
  date: string | number;
  isMemberOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-2">
        <div className="date-text">{formatDate(date)}</div>
        {isMemberOnly && (
          <div className="bg-amber-500/90 text-white px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1">
            <Lock className="h-3 w-3" />
            会員限定
          </div>
        )}
      </div>
      <div className="contents-title">{title}</div>
    </div>
  );
}
