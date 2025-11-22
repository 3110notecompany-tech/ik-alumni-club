import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SubscribeSuccessPage() {
  return (
    <div className="container mx-auto py-16 max-w-2xl px-4 text-center">
      <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />

      <h1 className="text-4xl font-bold mb-4">登録完了しました！</h1>

      <p className="text-lg text-muted-foreground mb-8">
        年間メンバーシップへのご登録ありがとうございます。
        <br />
        全てのコンテンツにアクセスできるようになりました。
      </p>

      <div className="bg-muted p-6 rounded-lg mb-8">
        <h2 className="font-semibold mb-3">次のステップ</h2>
        <ul className="text-left space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>マイページから会員情報を確認できます</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>ブログ・動画などの限定コンテンツをお楽しみください</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span>会員限定イベントの案内をお待ちください</span>
          </li>
        </ul>
      </div>

      <div className="flex gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/mypage">マイページへ</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">ホームへ</Link>
        </Button>
      </div>
    </div>
  );
}
