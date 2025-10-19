import { informations } from "@/db/schemas/informations";
import { informationFormSchema } from "@/zod/information";
import { z } from "zod";

export type Information = typeof informations.$inferSelect;
export type InformationFormData = z.infer<typeof informationFormSchema>;
