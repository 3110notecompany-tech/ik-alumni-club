export function ContentsHeader({ title }: { title: string }) {
  return (
    <div className="flex justify-between items-center w-full">
      <div>{title}</div>
      <div>VIEW ALL</div>
    </div>
  );
}
