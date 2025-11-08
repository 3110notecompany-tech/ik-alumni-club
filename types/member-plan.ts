import { memberPlans } from "@/db/schemas/member-plans";

export type MemberPlan = typeof memberPlans.$inferSelect;
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
  features: any;
  color: string | null;
};
