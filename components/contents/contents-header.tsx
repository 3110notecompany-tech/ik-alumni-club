import Link from "next/link";

export function ContentsHeader({
  title,
  viewAllHref,
}: {
  title: string;
  viewAllHref?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
      <div className="main-text">{title}</div>
      {viewAllHref && (
        <Link href={viewAllHref} className="view-all-text hover:opacity-70">
          VIEW ALL
        </Link>
      )}
    </div>
  );
}
