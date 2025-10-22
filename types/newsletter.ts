import { newsletters } from "@/db/schemas/newsletters";
import { newsletterFormSchema } from "@/zod/newsletter";
import { z } from "zod";

// DBから取得したニュースレターデータの型
export type Newsletter = typeof newsletters.$inferSelect;

// フォーム入力データの型
export type NewsletterFormData = z.infer<typeof newsletterFormSchema>;

// 作成者情報を含むニュースレターデータの型
export type NewsletterWithAuthor = Newsletter & {
  author: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
};
