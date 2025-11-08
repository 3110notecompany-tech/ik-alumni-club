import { setLocale } from "@/app/web/i18n/set-locale";
import { PlanSelectionForm } from "@/components/register/plan-selection-form";
import { getMemberPlans } from "@/actions/member-plans/get-member-plans";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  const result = await getMemberPlans();
  const plans = result.success ? result.data : [];

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-6xl">
        <PlanSelectionForm plans={plans} />
      </div>
    </div>
  );
}
