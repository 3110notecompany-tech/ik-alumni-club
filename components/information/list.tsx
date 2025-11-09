import { ContentsCard } from "@/components/contents/contents-card";
import Link from "next/link";

type Information = {
  id: string;
  title: string;
  date: string;
  content: string;
  published: boolean;
};

export function InformationList({ items }: { items: Information[] }) {
  return (
    <div className="flex flex-col gap-[30px]">
      {items.length === 0 ? (
        <p className="text-center text-gray-500">お知らせはありません</p>
      ) : (
        items.map((item) => (
          <Link key={item.id} href={`/information/${item.id}`}>
            <ContentsCard title={item.title} date={item.date} />
          </Link>
        ))
      )}
    </div>
  );
}
