import { setLocale } from "@/app/web/i18n/set-locale";
import { InformationDetail } from "@/components/information/detail";
import { getInformation } from "@/data/information";
import { notFound } from "next/navigation";

export default async function InformationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getInformation(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <InformationDetail item={item} />
    </div>
  );
}
