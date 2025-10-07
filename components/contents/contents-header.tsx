export function ContentsHeader({ title }: { title: string }) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="date-text">{title}</div>
      <div className="view-all-text">VIEW ALL</div>
    </div>
  );
}
