import { informations } from "@/db/schemas/informations";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const informationFormSchema = createInsertSchema(informations, {
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD形式で入力してください"),
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(255, "タイトルは255文字以内で入力してください"),
  content: z.string().trim().min(1, "本文を入力してください"),
  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "有効なURLを入力してください" }
    ),
  url: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "有効なURLを入力してください" }
    ),
  published: z.boolean(),
}).omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true
});
