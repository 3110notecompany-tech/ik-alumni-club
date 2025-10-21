"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleFormSchema } from "@/zod/schedule";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { createSchedule, updateSchedule } from "@/actions/schedule";
import { toast } from "sonner";
import { Schedule, ScheduleFormData } from "@/types/schedule";
import { format } from "date-fns";

export function ScheduleForm({
  defaultValues,
}: {
  defaultValues?: Schedule;
}) {
  const router = useRouter();
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          content: defaultValues.content,
          eventDate: format(new Date(defaultValues.eventDate), "yyyy-MM-dd'T'HH:mm"),
          imageUrl: defaultValues.imageUrl ?? "",
          linkUrl: defaultValues.linkUrl ?? "",
          sortOrder: defaultValues.sortOrder,
          published: defaultValues.published,
        }
      : {
          title: "",
          content: "",
          eventDate: "",
          imageUrl: "",
          linkUrl: "",
          sortOrder: 0,
          published: false,
        },
  });

  async function onSubmit(data: ScheduleFormData) {
    try {
      if (defaultValues) {
        await updateSchedule(defaultValues.id, data);
        toast.success("スケジュールを更新しました", {
          description: `${data.title}を更新しました`,
        });
      } else {
        await createSchedule(data);
        toast.success("スケジュールを作成しました", {
          description: `${data.title}を作成しました`,
        });
      }
      form.reset();
      router.push("/admin/schedules");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: `スケジュールの${defaultValues ? "更新" : "作成"}に失敗しました`,
      });
      console.error(error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>イベント名</FormLabel>
              <FormControl>
                <Input placeholder="例: 柏まつり" {...field} />
              </FormControl>
              <FormDescription>イベントの名前を入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>イベント詳細</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="イベントの詳細を入力してください"
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>イベントの詳細情報を入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>イベント日時</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormDescription>イベントの開催日時を選択してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>イベント画像URL（任意）</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg"
                  {...field}
                />
              </FormControl>
              <FormDescription>イベント画像のURLを入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>詳細ページURL（任意）</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>詳細情報ページのURLを入力してください</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>表示順</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                表示順を数値で指定してください（小さい数字ほど上に表示されます）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">公開状態</FormLabel>
                <FormDescription>
                  公開するとユーザーに表示されます
                </FormDescription>
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

        <Button type="submit" disabled={isSubmitting}>
          {defaultValues ? "スケジュールを更新" : "スケジュールを作成"}
        </Button>
      </form>
    </Form>
  );
}
