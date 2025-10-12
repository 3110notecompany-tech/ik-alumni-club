import { ContentsHeader } from "./contents-header";
import { ContentsCard } from "./contents-card";

export function Contents({
  title,
  items,
}: {
  title: string;
  items: Array<{ title: string; date: string | number }>;
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
