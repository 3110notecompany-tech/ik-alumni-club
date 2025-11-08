import { setLocale } from "@/app/web/i18n/set-locale";
import { RegisterAuthForm } from "@/components/register/register-auth-form";

export default async function RegisterAuthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterAuthForm />
      </div>
    </div>
  );
}
