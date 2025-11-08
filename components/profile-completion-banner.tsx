import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function ProfileCompletionBanner() {
  return (
    <Alert variant="default" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>プロフィール入力が必要です</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          会員限定コンテンツにアクセスするには、詳細なプロフィール情報の入力が必要です。
        </p>
        <Button asChild size="sm">
          <Link href="/profile/complete">プロフィールを入力する</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
