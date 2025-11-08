"use server";

import { db } from "@/db/drizzle";
import { members } from "@/db/schemas/member";
import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/session";

/**
 * 現在ログイン中のユーザーのmember情報を取得
 */
export async function getCurrentMember() {
  try {
    const session = await verifySession();
    const userId = session.user.id;

    const member = await db.query.members.findFirst({
      where: eq(members.userId, userId),
      with: {
        plan: true,
      },
    });

    if (!member) {
      return { success: false, error: "会員情報が見つかりません" };
    }

    return { success: true, data: member };
  } catch (error) {
    console.error("Failed to get current member:", error);
    return { success: false, error: "会員情報の取得に失敗しました" };
  }
}
