import "server-only";
import { db } from "@/db";
import { newsletters } from "@/db/schemas/newsletters";
import { eq, desc } from "drizzle-orm";

/**
 * 公開済みニュースレター一覧を取得(会員向け)
 */
export const getPublishedNewsletters = async () => {
  return db.query.newsletters.findMany({
    where: eq(newsletters.published, true),
    orderBy: [desc(newsletters.issueNumber)],
    with: {
      author: true,
    },
  });
};

/**
 * すべてのニュースレターを取得(管理者向け)
 */
export const getAllNewsletters = async () => {
  return db.query.newsletters.findMany({
    orderBy: [desc(newsletters.issueNumber)],
    with: {
      author: true,
    },
  });
};

/**
 * 特定のニュースレターを取得
 */
export const getNewsletter = async (id: string) => {
  return db.query.newsletters.findFirst({
    where: eq(newsletters.id, id),
    with: {
      author: true,
    },
  });
};

/**
 * 号数からニュースレターを取得
 */
export const getNewsletterByIssueNumber = async (issueNumber: number) => {
  return db.query.newsletters.findFirst({
    where: eq(newsletters.issueNumber, issueNumber),
    with: {
      author: true,
    },
  });
};

/**
 * 最新のニュースレターを取得(ホーム画面用)
 */
export const getLatestNewsletters = async (limit: number = 3) => {
  return db.query.newsletters.findMany({
    where: eq(newsletters.published, true),
    orderBy: [desc(newsletters.issueNumber)],
    limit,
  });
};

/**
 * 次の号数を取得
 */
export const getNextIssueNumber = async (): Promise<number> => {
  const latestNewsletter = await db.query.newsletters.findFirst({
    orderBy: [desc(newsletters.issueNumber)],
    columns: {
      issueNumber: true,
    },
  });

  return latestNewsletter ? latestNewsletter.issueNumber + 1 : 1;
};
