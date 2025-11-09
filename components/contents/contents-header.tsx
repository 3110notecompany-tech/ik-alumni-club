export function ContentsHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
      <div className="main-text">{title}</div>
      <div className="view-all-text">VIEW ALL</div>
    </div>
  );
}
