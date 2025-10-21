import { schedules } from "@/db/schemas/schedules";
import { scheduleFormSchema } from "@/zod/schedule";
import { z } from "zod";

export type Schedule = typeof schedules.$inferSelect;
export type ScheduleFormData = z.infer<typeof scheduleFormSchema>;
