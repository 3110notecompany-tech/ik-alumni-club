import { db } from "@/db";
import { informations } from "@/db/schemas/informations";
import { eq, desc, and } from "drizzle-orm";
import { canAccessMemberContent } from "@/lib/session";
import "server-only";

// 公開済みお知らせ一覧を取得（一般公開用）
// 会員限定コンテンツは会員のみ閲覧可能
export const getInformations = async () => {
  const isMember = await canAccessMemberContent();

  return db.query.informations.findMany({
    where: and(
      eq(informations.published, true),
      // 会員でない場合は会員限定コンテンツを除外
      isMember ? undefined : eq(informations.isMemberOnly, false)
    ),
    orderBy: [desc(informations.date)],
  });
};

// 全お知らせ一覧を取得（管理者用）
export const getAllInformations = async () => {
  return db.query.informations.findMany({
    orderBy: [desc(informations.date)],
  });
};

// 個別お知らせを取得
export const getInformation = async (id: string) => {
  return db.query.informations.findFirst({
    where: eq(informations.id, id),
  });
};
