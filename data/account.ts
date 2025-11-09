import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { eq, desc } from "drizzle-orm";
import "server-only";

// 全会員一覧を取得（管理者用）
export const getAllAccounts = async () => {
  return db.query.members.findMany({
    with: {
      user: true,
      plan: true,
    },
    orderBy: [desc(members.createdAt)],
  });
};

// 個別会員を取得（管理者用）
export const getAccountById = async (id: string) => {
  return db.query.members.findFirst({
    where: eq(members.id, id),
    with: {
      user: true,
      plan: true,
    },
  });
};
