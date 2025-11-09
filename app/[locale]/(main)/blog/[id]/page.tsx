import { setLocale } from "@/app/web/i18n/set-locale";
import { BlogDetail } from "@/components/blog/detail";
import { getBlog } from "@/data/blog";
import { notFound } from "next/navigation";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await setLocale(params);
  const { id } = await params;
  const item = await getBlog(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <BlogDetail item={item} />
    </div>
  );
}
