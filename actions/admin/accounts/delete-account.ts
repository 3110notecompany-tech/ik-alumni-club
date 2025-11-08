"use server";

import { db } from "@/db";
import { users } from "@/db/schemas/auth";
import { members } from "@/db/schemas/member";
import { verifyAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * 会員を削除（管理者用）
 * usersテーブルを削除するとmembersはcascade deleteされる
 */
export async function deleteAccount(accountId: string) {
  // 1. 管理者権限チェック
  await verifyAdmin();

  // 2. 会員情報を取得してuserIdを確認
  const member = await db.query.members.findFirst({
    where: eq(members.id, accountId),
  });

  if (!member) {
    throw new Error("会員が見つかりません");
  }

  // 3. usersテーブルから削除（membersは自動的にcascade delete）
  await db.delete(users).where(eq(users.id, member.userId));

  // 4. キャッシュ再検証
  revalidatePath("/admin/accounts");
}
