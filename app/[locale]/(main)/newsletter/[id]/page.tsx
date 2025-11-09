import { setLocale } from "@/app/web/i18n/set-locale";
import { NewsletterDetail } from "@/components/newsletters/detail";
import { getNewsletter } from "@/data/newsletter";
import { notFound } from "next/navigation";

export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getNewsletter(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <NewsletterDetail item={item} />
    </div>
  );
}
