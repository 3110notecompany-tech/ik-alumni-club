import { formatDate } from "@/lib/utils";
import Image from "next/image";

type Information = {
  id: string;
  title: string;
  date: string;
  content: string;
  imageUrl: string | null;
  url: string | null;
  published: boolean;
};

export function InformationDetail({ item }: { item: Information }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="date-text mb-4">{formatDate(item.date)}</div>
        <h1 className="main-text mb-6">{item.title}</h1>
      </div>

      {item.imageUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none whitespace-pre-wrap">
        {item.content}
      </div>

      {item.url && (
        <div className="mt-6">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            詳細はこちら
          </a>
        </div>
      )}
    </div>
  );
}
