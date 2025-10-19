import { InformationForm } from "@/components/information-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewInformationPage() {
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/informations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">お知らせ作成</h1>
        <p className="text-muted-foreground">新しいお知らせを作成します</p>
      </div>

      <InformationForm />
    </div>
  );
}
