export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // マーケティングページは独自のレイアウトを持つため
  // ここではシンプルにchildrenをレンダリング
  return <>{children}</>;
}
