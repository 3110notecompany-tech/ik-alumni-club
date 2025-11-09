import { setLocale } from "@/app/web/i18n/set-locale";
import { VideoDetail } from "@/components/video/detail";
import { getVideo } from "@/data/video";
import { notFound } from "next/navigation";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getVideo(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <VideoDetail item={item} />
    </div>
  );
}
