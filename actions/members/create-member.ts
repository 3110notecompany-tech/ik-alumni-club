"use server";

import { db } from "@/db/drizzle";
import { members } from "@/db/schemas/member";
import { users } from "@/db/schemas/auth";
import { eq } from "drizzle-orm";

/**
 * サインアップ後にmemberレコードを作成
 */
export async function createMemberAfterSignup(
  userId: string,
  email: string,
  planId?: number
) {
  try {
    // 既にmemberレコードが存在するかチェック
    const existingMember = await db
      .select()
      .from(members)
      .where(eq(members.userId, userId))
      .limit(1);

    if (existingMember.length > 0) {
      return { success: true, data: existingMember[0] };
    }

    // memberレコード作成
    const newMember = await db
      .insert(members)
      .values({
        userId,
        email,
        planId: planId || null,
        role: "member",
        status: "pending_profile",
        profileCompleted: false,
        isActive: true,
      })
      .returning();

    return { success: true, data: newMember[0] };
  } catch (error) {
    console.error("Failed to create member:", error);
    return { success: false, error: "会員情報の作成に失敗しました" };
  }
}

/**
 * memberレコードのplanIdを更新
 */
export async function updateMemberPlan(userId: string, planId: number) {
  try {
    const updated = await db
      .update(members)
      .set({ planId })
      .where(eq(members.userId, userId))
      .returning();

    if (updated.length === 0) {
      return { success: false, error: "会員情報が見つかりません" };
    }

    return { success: true, data: updated[0] };
  } catch (error) {
    console.error("Failed to update member plan:", error);
    return { success: false, error: "プラン情報の更新に失敗しました" };
  }
}
