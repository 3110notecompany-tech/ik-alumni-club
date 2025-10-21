"use client";

import { togglePublishVideo } from "@/actions/video";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function TogglePublishVideoButton({
  videoId,
  published,
}: {
  videoId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      await togglePublishVideo(videoId);
      toast.success(
        published ? "動画を非公開にしました" : "動画を公開しました"
      );
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: "公開状態の変更に失敗しました",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
    >
      {published ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </Button>
  );
}
