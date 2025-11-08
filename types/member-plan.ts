import { memberPlans } from "@/db/schemas/member-plans";

// 基本的な推論型
type MemberPlanInferred = typeof memberPlans.$inferSelect;

// featuresの型を明示的に定義
export type MemberPlan = Omit<MemberPlanInferred, 'features'> & {
  features: string[] | null;
};

export type NewMemberPlan = typeof memberPlans.$inferInsert;

// プランコードの型
export type PlanCode = "individual" | "business" | "platinum_individual" | "platinum_business";

// フロントエンド表示用の型
export type MemberPlanDisplay = {
  id: number;
  planCode: PlanCode;
  displayName: string;
  description: string | null;
  price: string;
  hierarchyLevel: number;
  isBusinessPlan: boolean;
  features: string[] | null;
  color: string | null;
};
