"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { memberProfileFormSchema, type MemberProfileFormData } from "@/zod/member-profile";
import { updateMemberProfile } from "@/actions/members/update-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Member } from "@/types/member";

type ProfileCompleteFormProps = {
  member: Member;
};

// 都道府県リスト
const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県",
  "沖縄県",
];

export function ProfileCompleteForm({ member }: ProfileCompleteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MemberProfileFormData>({
    resolver: zodResolver(memberProfileFormSchema),
    defaultValues: {
      lastName: member.lastName || "",
      firstName: member.firstName || "",
      lastNameKana: member.lastNameKana || "",
      firstNameKana: member.firstNameKana || "",
      postalCode: member.postalCode || "",
      prefecture: member.prefecture || "",
      city: member.city || "",
      address: member.address || "",
      building: member.building || "",
      phoneNumber: member.phoneNumber || "",
    },
  });

  const onSubmit = async (data: MemberProfileFormData) => {
    setIsLoading(true);
    try {
      const result = await updateMemberProfile(data);

      if (!result.success) {
        throw new Error(result.error || "更新に失敗しました");
      }

      toast.success("プロフィール情報を登録しました", {
        description: "会員限定コンテンツにアクセスできるようになりました",
      });

      router.push("/mypage");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました", {
        description: error instanceof Error ? error.message : "プロフィールの登録に失敗しました",
      });
      console.error("プロフィール登録エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>詳細情報</CardTitle>
        <CardDescription>
          必要事項を入力してください。入力いただいた情報は厳重に管理いたします。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 氏名 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">氏名</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓</FormLabel>
                      <FormControl>
                        <Input placeholder="山田" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>名</FormLabel>
                      <FormControl>
                        <Input placeholder="太郎" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="lastNameKana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>セイ（カタカナ）</FormLabel>
                      <FormControl>
                        <Input placeholder="ヤマダ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstNameKana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メイ（カタカナ）</FormLabel>
                      <FormControl>
                        <Input placeholder="タロウ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 住所 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">住所</h3>
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>郵便番号</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567" {...field} maxLength={7} />
                    </FormControl>
                    <FormDescription>ハイフンなし7桁の数字</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prefecture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>都道府県</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PREFECTURES.map((pref) => (
                          <SelectItem key={pref} value={pref}>
                            {pref}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>市区町村</FormLabel>
                    <FormControl>
                      <Input placeholder="渋谷区" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>町名番地</FormLabel>
                    <FormControl>
                      <Input placeholder="渋谷1-2-3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="building"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>建物名・部屋番号（任意）</FormLabel>
                    <FormControl>
                      <Input placeholder="渋谷マンション101号室" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 連絡先 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">連絡先</h3>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号</FormLabel>
                    <FormControl>
                      <Input placeholder="09012345678" {...field} maxLength={11} />
                    </FormControl>
                    <FormDescription>ハイフンなしで入力してください</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => router.push("/mypage")}
                disabled={isLoading}
              >
                後で入力する
              </Button>
              <Button type="submit" className="min-h-11" disabled={isLoading}>
                {isLoading ? "登録中..." : "登録する"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
