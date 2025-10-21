import { db } from "@/db";
import { videos } from "@/db/schemas/videos";
import { eq, desc } from "drizzle-orm";
import "server-only";

// 公開済み動画一覧を取得（一般公開用）
export const getVideos = async () => {
  return db.query.videos.findMany({
    where: eq(videos.published, true),
    orderBy: [desc(videos.videoDate)],
  });
};

// 全動画一覧を取得（管理者用）
export const getAllVideos = async () => {
  return db.query.videos.findMany({
    orderBy: [desc(videos.videoDate)],
  });
};

// 個別動画を取得
export const getVideo = async (id: string) => {
  return db.query.videos.findFirst({
    where: eq(videos.id, id),
  });
};

// 最新の動画を取得（Home画面表示用）
export const getRecentVideos = async (limit: number = 3) => {
  return db.query.videos.findMany({
    where: eq(videos.published, true),
    orderBy: [desc(videos.videoDate)],
    limit,
  });
};
