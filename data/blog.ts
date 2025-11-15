import "server-only";
import { db } from "@/db";
import { blogs } from "@/db/schemas/blogs";
import { desc, eq, and } from "drizzle-orm";
import { canAccessMemberContent } from "@/lib/session";

/**
 * 公開されているブログ一覧を取得（一般ユーザー向け）
 * 会員限定コンテンツは会員のみ閲覧可能
 */
export const getPublishedBlogs = async () => {
  const isMember = await canAccessMemberContent();

  return db.query.blogs.findMany({
    where: and(
      eq(blogs.published, true),
      // 会員でない場合は会員限定コンテンツを除外
      isMember ? undefined : eq(blogs.isMemberOnly, false)
    ),
    orderBy: [desc(blogs.createdAt)],
    with: {
      author: true,
    },
  });
};

/**
 * 全てのブログ一覧を取得（管理者向け）
 */
export const getAllBlogs = async () => {
  return db.query.blogs.findMany({
    orderBy: [desc(blogs.createdAt)],
    with: {
      author: true,
    },
  });
};

/**
 * IDで特定のブログを取得
 */
export const getBlog = async (id: string) => {
  return db.query.blogs.findFirst({
    where: eq(blogs.id, id),
    with: {
      author: true,
    },
  });
};

/**
 * 人気記事トップ5を取得
 * 会員限定コンテンツは会員のみ閲覧可能
 */
export const getPopularBlogs = async (limit: number = 5) => {
  const isMember = await canAccessMemberContent();

  return db.query.blogs.findMany({
    where: and(
      eq(blogs.published, true),
      // 会員でない場合は会員限定コンテンツを除外
      isMember ? undefined : eq(blogs.isMemberOnly, false)
    ),
    orderBy: [desc(blogs.viewCount)],
    limit,
  });
};

/**
 * 最新記事を取得（ホーム画面用）
 * 会員限定コンテンツは会員のみ閲覧可能
 */
export const getRecentBlogs = async (limit: number = 3) => {
  const isMember = await canAccessMemberContent();

  return db.query.blogs.findMany({
    where: and(
      eq(blogs.published, true),
      // 会員でない場合は会員限定コンテンツを除外
      isMember ? undefined : eq(blogs.isMemberOnly, false)
    ),
    orderBy: [desc(blogs.createdAt)],
    limit,
  });
};
