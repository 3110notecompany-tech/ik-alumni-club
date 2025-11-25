import Link from "next/link";

interface InformationCardProps {
  id: string;
  date: string;
  title: string;
}

export function InformationCard({ id, date, title }: InformationCardProps) {
  // 日付を "MM.DD" 形式に変換
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  return (
    <Link href={`/information/${id}`} className="h-full">
      <div className="flex gap-4 md:gap-6 hover:opacity-80 transition-opacity items-center border-2 border-white rounded-[10px] p-4 md:p-6 h-full">
        <div className="flex-shrink-0">
          <div className="bg-white text-black rounded-full w-[60px] h-[60px] md:w-[80px] md:h-[80px] flex items-center justify-center">
            <p className="text-lg md:text-xl font-bold">
              {formatDate(date)}
            </p>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-base md:text-lg font-bold text-white">
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
}
