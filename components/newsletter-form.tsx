"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterFormSchema, type NewsletterFormData } from "@/zod/newsletter";
import { createNewsletter, updateNewsletter } from "@/actions/newsletter";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputImage } from "@/components/input-image";
import { InputFile } from "@/components/input-file";

interface NewsletterFormProps {
  defaultValues?: NewsletterFormData & { id?: string };
  mode: "create" | "edit";
  nextIssueNumber?: number;
}

export function NewsletterForm({
  defaultValues,
  mode,
  nextIssueNumber,
}: NewsletterFormProps) {
  const router = useRouter();
  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: defaultValues
      ? {
          issueNumber: Number(defaultValues.issueNumber),
          title: defaultValues.title,
          excerpt: defaultValues.excerpt,
          content: defaultValues.content,
          thumbnailUrl: defaultValues.thumbnailUrl ?? "",
          pdfUrl: defaultValues.pdfUrl ?? "",
          category: defaultValues.category,
          published: defaultValues.published,
        }
      : {
          issueNumber: nextIssueNumber || 1,
          title: "",
          excerpt: "",
          content: "",
          thumbnailUrl: "",
          pdfUrl: "",
          category: "regular",
          published: false,
        },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      if (mode === "create") {
        await createNewsletter(data);
        toast.success("ニュースレターを作成しました", {
          description: `第${data.issueNumber}号を作成しました`,
        });
      } else if (defaultValues?.id) {
        await updateNewsletter(defaultValues.id, data);
        toast.success("ニュースレターを更新しました", {
          description: `第${data.issueNumber}号を更新しました`,
        });
      }
      router.push("/admin/newsletters");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `ニュースレターの${mode === "create" ? "作成" : "更新"}に失敗しました`,
      });
      console.error(error);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 号数 */}
        <FormField
          control={form.control}
          name="issueNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>号数 *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1"
                  {...field}
                  disabled={mode === "edit"}
                />
              </FormControl>
              <FormDescription>
                {mode === "edit"
                  ? "号数は変更できません"
                  : "次の号数が自動的に設定されます"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* タイトル */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル *</FormLabel>
              <FormControl>
                <Input placeholder="第1号 2025年春号" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 概要 */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>概要 *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="今号の見どころを簡潔に..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                一覧ページで表示される概要です（500文字以内）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 本文 */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>本文 *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ニュースレターの本文をHTML形式で入力..."
                  rows={15}
                  className="font-mono"
                  {...field}
                />
              </FormControl>
              <FormDescription>HTMLタグを使用できます</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* サムネイル画像 */}
        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>サムネイル画像</FormLabel>
              <FormControl>
                <InputImage
                  width={400}
                  aspectRatio={16 / 9}
                  resultWidth={800}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                画像をドラッグ&ドロップまたはクリックして選択してください
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PDF版 */}
        <FormField
          control={form.control}
          name="pdfUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PDF版</FormLabel>
              <FormControl>
                <InputFile
                  value={field.value || ""}
                  onChange={field.onChange}
                  accept="application/pdf"
                  maxSize={1024 * 1024 * 20} // 20MB
                  placeholder="PDFファイルを選択してください"
                />
              </FormControl>
              <FormDescription>
                PDF版の会報ファイルをアップロードしてください（最大20MB）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* カテゴリ */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="regular">定期号</SelectItem>
                  <SelectItem value="special">特別号</SelectItem>
                  <SelectItem value="extra">号外</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 公開状態 */}
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">公開する</FormLabel>
                <FormDescription>ONにすると会員に公開されます</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "処理中..."
              : mode === "create"
              ? "作成"
              : "更新"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
