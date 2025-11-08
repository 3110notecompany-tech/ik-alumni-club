import { RegistrationProvider } from "@/contexts/RegistrationContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証画面はヘッダー・フッターなしで、
  // ページ内で独自のレイアウトを実装する
  return <RegistrationProvider>{children}</RegistrationProvider>;
}
