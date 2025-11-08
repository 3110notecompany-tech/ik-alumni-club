"use server";

import { db } from "@/db";
import { memberPlans } from "@/db/schemas/member-plans";
import { eq } from "drizzle-orm";
import type { MemberPlan } from "@/types/member-plan";

/**
 * 有効な会員プラン一覧を取得
 */
export async function getMemberPlans() {
  try {
    const plans = await db
      .select()
      .from(memberPlans)
      .where(eq(memberPlans.isActive, true))
      .orderBy(memberPlans.hierarchyLevel, memberPlans.isBusinessPlan);

    // JSONBフィールドを適切な型に変換
    const typedPlans: MemberPlan[] = plans.map(plan => ({
      ...plan,
      features: plan.features ? (typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features) : null,
    }));

    return { success: true, data: typedPlans };
  } catch (error) {
    console.error("Failed to get member plans:", error);
    return { success: false, error: "プラン情報の取得に失敗しました" };
  }
}

/**
 * 特定のプランを取得
 */
export async function getMemberPlanById(id: number) {
  try {
    const plan = await db
      .select()
      .from(memberPlans)
      .where(eq(memberPlans.id, id))
      .limit(1);

    if (plan.length === 0) {
      return { success: false, error: "プランが見つかりません" };
    }

    return { success: true, data: plan[0] };
  } catch (error) {
    console.error("Failed to get member plan:", error);
    return { success: false, error: "プラン情報の取得に失敗しました" };
  }
}
