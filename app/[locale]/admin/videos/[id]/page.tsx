import { getVideo } from "@/data/video";
import { VideoForm } from "@/components/video-form";
import { notFound } from "next/navigation";

export default async function EditVideoPage({
  params,
}: {
  params: { id: string };
}) {
  const video = await getVideo(params.id);

  if (!video) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">動画編集</h1>
      <VideoForm defaultValues={video} />
    </div>
  );
}
