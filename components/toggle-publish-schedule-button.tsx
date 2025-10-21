"use client";

import { togglePublishSchedule } from "@/actions/schedule";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export function TogglePublishScheduleButton({
  scheduleId,
  initialPublished,
}: {
  scheduleId: string;
  initialPublished: boolean;
}) {
  const router = useRouter();
  const [published, setPublished] = useState(initialPublished);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    setPublished(checked); // 楽観的UI更新

    try {
      await togglePublishSchedule(scheduleId);
      toast.success(
        checked ? "スケジュールを公開しました" : "スケジュールを非公開にしました"
      );
      router.refresh();
    } catch (error) {
      setPublished(!checked); // エラー時は元に戻す
      toast.error("エラーが発生しました", {
        description: "公開状態の変更に失敗しました",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch
      checked={published}
      onCheckedChange={handleToggle}
      disabled={isLoading}
    />
  );
}
