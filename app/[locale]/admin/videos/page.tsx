import { getAllVideos } from "@/data/video";
import { VideoCard } from "@/components/video-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminVideosPage() {
  const videos = await getAllVideos();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">動画管理</h1>
        <Button asChild>
          <Link href="/admin/videos/new">新規作成</Link>
        </Button>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg mb-4">動画がありません</h3>
          <Button asChild>
            <Link href="/admin/videos/new">新規作成</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} showActions />
          ))}
        </div>
      )}
    </div>
  );
}
