import { pets, petType } from "@/db/schemas/pet";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const petFormSchema = createInsertSchema(pets, {
    hp: z.number().min(0, "HPは0から100の間で入力してください").max(100, "HPは0から100の間で入力してください"),
    name: z.string().trim().min(1, "名前は一文字以上にしてください"),
    type: z.enum(petType),
}).omit({ ownerId: true });