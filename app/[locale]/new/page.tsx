import { PetForm } from "@/components/pet-form";
import { Metadata } from "next";
import { setLocale } from "@/app/web/i18n/set-locale";

export const metadata: Metadata = {
  title: "新しいペットの登録",
};

export default async function NewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  return (
    <div className="container py-10">
      <PetForm />
    </div>
  );
}
