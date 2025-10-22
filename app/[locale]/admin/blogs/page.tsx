import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import { getAllBlogs } from "@/data/blog";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ブログ管理</h1>
          <p className="text-muted-foreground">
            ブログ記事の作成・編集・削除ができます
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">ブログがありません</h3>
            <p className="text-sm text-muted-foreground">
              新しいブログ記事を作成してください
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/blogs/new">
                <Plus className="mr-2 h-4 w-4" />
                新規作成
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} isAdmin={true} />
          ))}
        </div>
      )}
    </div>
  );
}
