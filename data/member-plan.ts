import { db } from "@/db";
import { memberPlans } from "@/db/schemas/member-plans";
import { eq } from "drizzle-orm";
import "server-only";

// 全プラン一覧を取得
export const getAllMemberPlans = async () => {
  return db.query.memberPlans.findMany({
    where: eq(memberPlans.isActive, true),
    orderBy: (memberPlans, { asc }) => [asc(memberPlans.hierarchyLevel)],
  });
};

// 個別プランを取得
export const getMemberPlanById = async (id: number) => {
  return db.query.memberPlans.findFirst({
    where: eq(memberPlans.id, id),
  });
};
