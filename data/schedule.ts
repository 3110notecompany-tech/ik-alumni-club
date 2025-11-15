import { db } from "@/db";
import { schedules } from "@/db/schemas/schedules";
import { eq, desc, asc, gte, and } from "drizzle-orm";
import { canAccessMemberContent } from "@/lib/session";
import "server-only";

// 公開済みスケジュール一覧を取得（一般公開用）
// 会員限定コンテンツは会員のみ閲覧可能
export const getSchedules = async () => {
  const isMember = await canAccessMemberContent();

  return db.query.schedules.findMany({
    where: and(
      eq(schedules.published, true),
      // 会員でない場合は会員限定コンテンツを除外
      isMember ? undefined : eq(schedules.isMemberOnly, false)
    ),
    orderBy: [asc(schedules.sortOrder), asc(schedules.eventDate)],
  });
};

// 未来のイベントのみ取得（公開用）
// 会員限定コンテンツは会員のみ閲覧可能
export const getUpcomingSchedules = async () => {
  const isMember = await canAccessMemberContent();
  const now = new Date();

  return db.query.schedules.findMany({
    where: and(
      eq(schedules.published, true),
      gte(schedules.eventDate, now),
      // 会員でない場合は会員限定コンテンツを除外
      isMember ? undefined : eq(schedules.isMemberOnly, false)
    ),
    orderBy: [asc(schedules.sortOrder), asc(schedules.eventDate)],
  });
};

// 全スケジュール一覧を取得（管理者用）
export const getAllSchedules = async () => {
  return db.query.schedules.findMany({
    orderBy: [asc(schedules.sortOrder), desc(schedules.eventDate)],
  });
};

// 個別スケジュールを取得
export const getSchedule = async (id: string) => {
  return db.query.schedules.findFirst({
    where: eq(schedules.id, id),
  });
};
