"use server";

import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/session";
import { memberProfileFormSchema, type MemberProfileFormData } from "@/zod/member-profile";

/**
 * プロフィール情報を更新
 */
export async function updateMemberProfile(data: MemberProfileFormData) {
  try {
    // バリデーション
    const validatedData = memberProfileFormSchema.parse(data);

    const session = await verifySession();
    const userId = session.user.id;

    // プロフィール更新 + status を 'active' に変更
    const updated = await db
      .update(members)
      .set({
        lastName: validatedData.lastName,
        firstName: validatedData.firstName,
        lastNameKana: validatedData.lastNameKana,
        firstNameKana: validatedData.firstNameKana,
        postalCode: validatedData.postalCode,
        prefecture: validatedData.prefecture,
        city: validatedData.city,
        address: validatedData.address,
        building: validatedData.building || null,
        phoneNumber: validatedData.phoneNumber,
        status: "active",
        profileCompleted: true,
      })
      .where(eq(members.userId, userId))
      .returning();

    if (updated.length === 0) {
      return { success: false, error: "会員情報が見つかりません" };
    }

    return { success: true, data: updated[0] };
  } catch (error) {
    console.error("Failed to update member profile:", error);
    return {
      success: false,
      error: "プロフィール情報の更新に失敗しました",
    };
  }
}
