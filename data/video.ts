import { db } from "@/db";
import { videos } from "@/db/schemas/videos";
import { eq, desc, and, or } from "drizzle-orm";
import { canAccessMemberContent } from "@/lib/session";
import "server-only";

// 公開済み動画一覧を取得（一般公開用）
// 会員限定コンテンツは会員のみ閲覧可能
export const getVideos = async () => {
  const isMember = await canAccessMemberContent();

  return db.query.videos.findMany({
    where: and(
      eq(videos.published, true),
      // 会員でない場合は会員限定コンテンツを除外
      isMember ? undefined : eq(videos.isMemberOnly, false)
    ),
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
// 会員限定コンテンツは会員のみ閲覧可能
export const getRecentVideos = async (limit: number = 3) => {
  const isMember = await canAccessMemberContent();

  return db.query.videos.findMany({
    where: and(
      eq(videos.published, true),
      // 会員でない場合は会員限定コンテンツを除外
      isMember ? undefined : eq(videos.isMemberOnly, false)
    ),
    orderBy: [desc(videos.videoDate)],
    limit,
  });
};
