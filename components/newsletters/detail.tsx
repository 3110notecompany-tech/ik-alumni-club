import Image from "next/image";

type Newsletter = {
  id: string;
  issueNumber: number;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string | null;
  pdfUrl: string | null;
  authorName: string | null;
  category: string | null;
  viewCount: number;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function NewsletterDetail({ item }: { item: Newsletter }) {
  return (
    <article className="flex flex-col gap-8 max-w-4xl mx-auto">
      <header>
        <div className="text-sm font-medium text-blue-600 mb-2">
          第{item.issueNumber}号
          {item.category && ` - ${item.category}`}
        </div>
        <h1 className="main-text mb-4">{item.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {item.authorName && <span>著者: {item.authorName}</span>}
          {item.publishedAt && (
            <span>
              {new Date(item.publishedAt).toLocaleDateString("ja-JP")}
            </span>
          )}
          <span>閲覧数: {item.viewCount}</span>
        </div>
      </header>

      {item.thumbnailUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-700 mb-8">{item.excerpt}</p>
        <div className="whitespace-pre-wrap">{item.content}</div>
      </div>

      {item.pdfUrl && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <a
            href={item.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            PDFをダウンロード
          </a>
        </div>
      )}
    </article>
  );
}
