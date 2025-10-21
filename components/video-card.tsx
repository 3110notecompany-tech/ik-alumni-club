import { Video } from "@/types/video";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ExternalLink, Eye } from "lucide-react";
import { DeleteVideoButton } from "./delete-video-button";
import { TogglePublishVideoButton } from "./toggle-publish-video-button";

export function VideoCard({
  video,
  showActions = false,
}: {
  video: Video;
  showActions?: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant={video.published ? "default" : "secondary"}>
              {video.published ? "公開" : "下書き"}
            </Badge>
            {video.viewCount > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {video.viewCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {video.videoDate}
          </div>
        </div>
        <CardTitle className="line-clamp-2">{video.title}</CardTitle>
        {video.authorName && (
          <CardDescription>投稿者: {video.authorName}</CardDescription>
        )}
      </CardHeader>
      {video.thumbnailUrl && (
        <CardContent>
          <div className="relative h-48 w-full">
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="rounded-md object-cover"
            />
          </div>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex gap-2">
        {showActions ? (
          <>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/videos/${video.id}`}>編集</Link>
            </Button>
            <TogglePublishVideoButton
              videoId={video.id}
              published={video.published}
            />
            <DeleteVideoButton videoId={video.id} videoTitle={video.title} />
          </>
        ) : (
          <Button asChild className="w-full">
            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              動画を見る
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
