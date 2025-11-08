import { setLocale } from "@/app/web/i18n/set-locale";
import { TermsAgreementForm } from "@/components/register/terms-agreement-form";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <TermsAgreementForm />
      </div>
    </div>
  );
}
