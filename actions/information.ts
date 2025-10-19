"use server";

import { db } from "@/db";
import { informations } from "@/db/schemas/informations";
import { verifyAdmin } from "@/lib/session";
import { InformationFormData } from "@/types/information";
import { informationFormSchema } from "@/zod/information";
import { eq } from "drizzle-orm";

// お知らせ作成
export async function createInformation(formData: InformationFormData) {
  const { userId } = await verifyAdmin();
  const data = informationFormSchema.parse(formData);

  await db.insert(informations).values({
    ...data,
    createdBy: userId,
  });
}

// お知らせ更新
export async function updateInformation(
  id: string,
  formData: InformationFormData
) {
  await verifyAdmin();
  const data = informationFormSchema.parse(formData);

  await db
    .update(informations)
    .set(data)
    .where(eq(informations.id, id));
}

// お知らせ削除
export async function deleteInformation(id: string) {
  await verifyAdmin();

  await db.delete(informations).where(eq(informations.id, id));
}

// 公開/非公開切り替え
export async function togglePublishInformation(id: string) {
  await verifyAdmin();

  const information = await db.query.informations.findFirst({
    where: eq(informations.id, id),
  });

  if (!information) {
    throw new Error("お知らせが見つかりません");
  }

  await db
    .update(informations)
    .set({ published: !information.published })
    .where(eq(informations.id, id));
}
