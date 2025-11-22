import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function SubscribeCancelPage() {
  return (
    <div className="container mx-auto py-16 max-w-2xl px-4 text-center">
      <XCircle className="w-20 h-20 text-orange-600 mx-auto mb-6" />

      <h1 className="text-4xl font-bold mb-4">登録がキャンセルされました</h1>

      <p className="text-lg text-muted-foreground mb-8">
        サブスクリプションの登録がキャンセルされました。
        <br />
        いつでも再度お試しいただけます。
      </p>

      <div className="bg-muted p-6 rounded-lg mb-8">
        <h2 className="font-semibold mb-3">ご不明な点がございますか？</h2>
        <p className="text-sm text-muted-foreground">
          登録に関してご質問やお困りの点がございましたら、
          <br />
          お気軽にお問い合わせください。
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/subscribe">プランを見る</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">ホームへ</Link>
        </Button>
      </div>
    </div>
  );
}
