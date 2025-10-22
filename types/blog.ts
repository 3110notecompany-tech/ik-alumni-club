import { blogs } from "@/db/schemas/blogs";
import { blogFormSchema } from "@/zod/blog";
import { z } from "zod";

// DBから取得したブログデータの型
export type Blog = typeof blogs.$inferSelect;

// フォーム入力データの型
export type BlogFormData = z.infer<typeof blogFormSchema>;

// リレーション含むブログデータの型（将来的に使用）
export type BlogWithAuthor = Blog & {
  author: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
};
