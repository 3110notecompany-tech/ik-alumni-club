import { z } from "zod";

/**
 * プラン選択フォームのバリデーションスキーマ
 */
export const planSelectionFormSchema = z.object({
  planId: z.number({
    required_error: "プランを選択してください",
    invalid_type_error: "有効なプランを選択してください",
  }).int("有効なプランを選択してください").positive("有効なプランを選択してください"),
});

export type PlanSelectionFormData = z.infer<typeof planSelectionFormSchema>;

/**
 * 会員規約同意フォームのバリデーションスキーマ
 */
export const termsAgreementFormSchema = z.object({
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "会員規約に同意してください",
  }),
});

export type TermsAgreementFormData = z.infer<typeof termsAgreementFormSchema>;
