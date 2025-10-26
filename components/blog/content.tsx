import { ContentsHeader } from "@/components/contents/contents-header";
import { ContentsCard } from "@/components/contents/contents-card";
import { getTranslations } from "next-intl/server";
import { getRecentBlogs } from "@/data/blog";

export async function BlogContents() {
  const t = await getTranslations("Contents");
  const blogs = await getRecentBlogs(3);

  const items = blogs.map((blog) => ({
    title: blog.title,
    date: new Date(blog.createdAt).toLocaleDateString("ja-JP"),
  }));

  return (
    <div className="flex flex-col">
      <ContentsHeader title={t("blog")} />
      <div className="flex flex-col gap-[30px] mt-[60px]">
        {items.length === 0 ? (
          <p>ブログ記事はありません</p>
        ) : (
          items.map((item, index) => (
            <ContentsCard key={index} title={item.title} date={item.date} />
          ))
        )}
      </div>
    </div>
  );
}
