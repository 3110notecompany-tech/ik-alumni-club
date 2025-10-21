import { videos } from "@/db/schemas/videos";
import { videoFormSchema } from "@/zod/video";
import { z } from "zod";

export type Video = typeof videos.$inferSelect;
export type VideoFormData = z.infer<typeof videoFormSchema>;
