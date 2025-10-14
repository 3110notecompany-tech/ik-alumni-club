import { pets } from "@/db/schemas/pet";
import { petFormSchema } from "@/zod/pet";
import { z } from "better-auth";

export type Pet = typeof pets.$inferSelect;
export type PetType = Pet["type"];
export type PetFormData = z.infer<typeof petFormSchema>;
