import { formatDate } from "@/lib/utils";
import { ContentsHeader } from "./contents-header";
import { ContentsCard } from "./contents-card";

export function Contents({
  title = "INFORMATION",
  items = [
    { title: "次回のイベント案内", date: "2025/10/15" },
    { title: "会員限定セミナー開催のお知らせ", date: "2025/10/10" },
    { title: "新メンバー紹介", date: "2025/10/05" },
    { title: "活動報告：10月第1週", date: "2025/10/01" },
  ],
}: {
  title?: string;
  items?: Array<{ title: string; date: string | number }>;
}) {
  return (
    <div className="flex flex-col">
      <ContentsHeader title={title} />
      <div className="flex flex-col gap-[30px] mt-[60px]">
        {items.map((item, index) => (
          <ContentsCard key={index} title={item.title} date={item.date} />
        ))}
      </div>
    </div>
  );
}
