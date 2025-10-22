"use server";

import { db } from "@/db";
import { newsletters } from "@/db/schemas/newsletters";
import { newsletterFormSchema, type NewsletterFormData } from "@/zod/newsletter";
import { verifyAdmin } from "@/lib/session";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * ニュースレターを新規作成
 */
export async function createNewsletter(formData: NewsletterFormData) {
  // 1. 管理者権限チェック
  const { userId } = await verifyAdmin();

  // 2. バリデーション
  const data = newsletterFormSchema.parse(formData);

  // 3. ユーザー情報取得（authorName設定用）
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  // 4. データベースに挿入
  const [newNewsletter] = await db
    .insert(newsletters)
    .values({
      ...data,
      authorId: userId,
      authorName: user.name,
      thumbnailUrl: data.thumbnailUrl || null,
      pdfUrl: data.pdfUrl || null,
      category: data.category || null,
      publishedAt: data.published ? new Date() : null,
    })
    .returning();

  // 5. キャッシュ再検証
  revalidatePath("/admin/newsletters");
  revalidatePath("/newsletters");

  return newNewsletter;
}

/**
 * ニュースレターを更新
 */
export async function updateNewsletter(id: string, formData: NewsletterFormData) {
  // 1. 管理者権限チェック
  await verifyAdmin();

  // 2. バリデーション
  const data = newsletterFormSchema.parse(formData);

  // 3. 現在のニュースレター情報を取得
  const currentNewsletter = await db.query.newsletters.findFirst({
    where: eq(newsletters.id, id),
    columns: {
      published: true,
      publishedAt: true,
    },
  });

  if (!currentNewsletter) {
    throw new Error("ニュースレターが見つかりません");
  }

  // 4. publishedAtの処理
  let publishedAt = currentNewsletter.publishedAt;
  if (!currentNewsletter.published && data.published) {
    // 公開状態が false → true に変更された場合
    publishedAt = new Date();
  }

  // 5. データベース更新
  const [updatedNewsletter] = await db
    .update(newsletters)
    .set({
      ...data,
      thumbnailUrl: data.thumbnailUrl || null,
      pdfUrl: data.pdfUrl || null,
      category: data.category || null,
      publishedAt,
    })
    .where(eq(newsletters.id, id))
    .returning();

  // 6. キャッシュ再検証
  revalidatePath("/admin/newsletters");
  revalidatePath("/newsletters");
  revalidatePath(`/newsletters/${id}`);

  return updatedNewsletter;
}

/**
 * ニュースレターを削除
 */
export async function deleteNewsletter(id: string) {
  // 1. 管理者権限チェック
  await verifyAdmin();

  // 2. データベースから削除
  await db.delete(newsletters).where(eq(newsletters.id, id));

  // 3. キャッシュ再検証
  revalidatePath("/admin/newsletters");
  revalidatePath("/newsletters");
}

/**
 * 閲覧数をインクリメント
 */
export async function incrementNewsletterViewCount(id: string) {
  // 権限チェック不要（会員ユーザーも実行可能）
  await db
    .update(newsletters)
    .set({
      viewCount: sql`${newsletters.viewCount} + 1`,
    })
    .where(eq(newsletters.id, id));

  revalidatePath(`/newsletters/${id}`);
}

/**
 * ニュースレターの公開状態を切り替え
 */
export async function toggleNewsletterPublish(id: string, published: boolean) {
  await verifyAdmin();

  const updateData: any = { published };

  // 公開する場合、publishedAtを設定
  if (published) {
    const currentNewsletter = await db.query.newsletters.findFirst({
      where: eq(newsletters.id, id),
      columns: { publishedAt: true },
    });

    if (!currentNewsletter?.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  await db
    .update(newsletters)
    .set(updateData)
    .where(eq(newsletters.id, id));

  revalidatePath("/admin/newsletters");
  revalidatePath("/newsletters");
}
