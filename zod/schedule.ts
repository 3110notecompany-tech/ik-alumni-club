import { schedules } from "@/db/schemas/schedules";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const scheduleFormSchema = createInsertSchema(schedules, {
  title: z
    .string()
    .trim()
    .min(1, "イベント名を入力してください")
    .max(255, "イベント名は255文字以内で入力してください"),
  content: z.string().trim().min(1, "イベント詳細を入力してください"),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "日時を正しく入力してください"),
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
  linkUrl: z
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
  sortOrder: z.number().int().default(0),
  published: z.boolean(),
}).omit({
  id: true,
  authorId: true,
  authorName: true,
  authorEmail: true,
  createdAt: true,
  updatedAt: true,
});
