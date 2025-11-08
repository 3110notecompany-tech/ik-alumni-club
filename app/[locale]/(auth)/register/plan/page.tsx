import { setLocale } from "@/app/web/i18n/set-locale";
import { PlanSelectionForm } from "@/components/register/plan-selection-form";
import { getMemberPlans } from "@/actions/member-plans/get-member-plans";
import type { MemberPlan } from "@/types/member-plan";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  const result = await getMemberPlans();
  const plans: MemberPlan[] = result.success && result.data ? result.data : [];

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-6xl">
        <PlanSelectionForm plans={plans} />
      </div>
    </div>
  );
}
