import { setLocale } from "@/app/web/i18n/set-locale";
import { BlogList } from "@/components/blog/list";
import { getPublishedBlogs } from "@/data/blog";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("Contents");
  const items = await getPublishedBlogs();

  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <h1 className="main-text mb-10">{t("blog")}</h1>
      <BlogList items={items} />
    </div>
  );
}
