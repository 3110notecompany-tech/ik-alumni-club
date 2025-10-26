"use server";

import { db } from "@/db";
import { newsletters } from "@/db/schemas/newsletters";
import { newsletterFormSchema, type NewsletterFormData } from "@/zod/newsletter";
import { verifyAdmin } from "@/lib/session";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { resolveImageUpload } from "@/lib/storage";
import { nanoid } from "nanoid";

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

  // 4. 画像URLの処理（dataURLの場合はアップロード）
  const newsletterId = nanoid();
  const thumbnailUrl = data.thumbnailUrl
    ? await resolveImageUpload(`newsletters/${newsletterId}`, data.thumbnailUrl)
    : null;

  // 5. PDF URLの処理（dataURLの場合はアップロード）
  const pdfUrl = data.pdfUrl
    ? await resolveImageUpload(`newsletters/${newsletterId}`, data.pdfUrl)
    : null;

  // 6. データベースに挿入
  const [newNewsletter] = await db
    .insert(newsletters)
    .values({
      ...data,
      authorId: userId,
      authorName: user.name,
      thumbnailUrl,
      pdfUrl,
      category: data.category || null,
      publishedAt: data.published ? new Date() : null,
    })
    .returning();

  // 6. キャッシュ再検証
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

  // 5. 画像URLの処理（dataURLの場合はアップロード）
  const thumbnailUrl = data.thumbnailUrl
    ? await resolveImageUpload(`newsletters/${id}`, data.thumbnailUrl)
    : null;

  // 6. PDF URLの処理（dataURLの場合はアップロード）
  const pdfUrl = data.pdfUrl
    ? await resolveImageUpload(`newsletters/${id}`, data.pdfUrl)
    : null;

  // 7. データベース更新
  const [updatedNewsletter] = await db
    .update(newsletters)
    .set({
      ...data,
      thumbnailUrl,
      pdfUrl,
      category: data.category || null,
      publishedAt,
    })
    .where(eq(newsletters.id, id))
    .returning();

  // 7. キャッシュ再検証
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
