import { Contents } from "@/components/contents/content";
import { getTranslations } from "next-intl/server";
import { getRecentBlogs } from "@/data/blog";

export async function BlogContents() {
  const t = await getTranslations("Contents");
  const blogs = await getRecentBlogs(3);

  const items = blogs.map((blog) => ({
    title: blog.title,
    date: new Date(blog.createdAt).toLocaleDateString("ja-JP"),
  }));

  return <Contents title={t("blog")} items={items} />;
}
