import { signupFormSchema } from "@/zod/signup";
import { z } from "zod";

export type SignupFormData = z.infer<typeof signupFormSchema>;
