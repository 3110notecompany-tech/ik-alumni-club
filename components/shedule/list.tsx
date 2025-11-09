import Link from "next/link";
import Image from "next/image";

type Schedule = {
  id: string;
  title: string;
  content: string;
  eventDate: Date;
  imageUrl: string | null;
  linkUrl: string | null;
  sortOrder: number;
  published: boolean;
  authorName: string | null;
};

export function ScheduleList({ items }: { items: Schedule[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">
          スケジュールはありません
        </p>
      ) : (
        items.map((item) => (
          <Link
            key={item.id}
            href={`/schedule/${item.id}`}
            className="group flex flex-col rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
          >
            {item.imageUrl && (
              <div className="relative w-full aspect-video">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="text-sm font-medium text-blue-600">
                {new Date(item.eventDate).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </div>
              <h3 className="font-semibold text-lg line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {item.content}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
