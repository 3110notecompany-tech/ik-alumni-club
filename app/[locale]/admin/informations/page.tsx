import { InformationCard } from "@/components/information-card";
import { Button } from "@/components/ui/button";
import { getAllInformations } from "@/data/information";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminInformationsPage() {
  const informations = await getAllInformations();

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">お知らせ管理</h1>
          <p className="text-muted-foreground">
            お知らせの作成・編集・削除ができます
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/informations/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {informations.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">お知らせがありません</h3>
            <p className="text-sm text-muted-foreground">
              新しいお知らせを作成してください
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/informations/new">
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {informations.map((information) => (
            <InformationCard
              key={information.id}
              information={information}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
