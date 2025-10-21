import { getRecentVideos } from "@/data/video";
import { getTranslations } from "next-intl/server";
import { VideoContentsWrapper } from "./video-contents-wrapper";

export async function VideoContents() {
  const t = await getTranslations("Contents");

  // データベースから動画を取得（静的データの代わり）
  const videos = await getRecentVideos(5);
  const items = videos.map((video) => ({
    videoUrl: video.videoUrl,
    title: video.title,
  }));

  return <VideoContentsWrapper title={t("video")} items={items} />;
}
