import { setLocale } from "@/app/web/i18n/set-locale";
import { VideoList } from "@/components/video/list";
import { getVideos } from "@/data/video";
import { getTranslations } from "next-intl/server";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getVideos();

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <h1 className="main-text mb-10">{t("video")}</h1>
      <VideoList items={items} />
    </div>
  );
}
