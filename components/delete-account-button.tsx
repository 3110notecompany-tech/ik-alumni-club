"use client";

import { deleteAccount } from "@/actions/admin/accounts/delete-account";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeleteAccountButton({
  accountId,
  accountName,
}: {
  accountId: string;
  accountName: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteAccount(accountId);
      toast.success("会員を削除しました", {
        description: `${accountName}を削除しました`,
      });
      router.push("/admin/accounts");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: "会員の削除に失敗しました",
      });
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          削除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            「{accountName}」を削除します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
