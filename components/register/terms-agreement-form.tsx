"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { termsAgreementFormSchema, type TermsAgreementFormData } from "@/zod/plan-selection";
import { useRegistration } from "@/contexts/RegistrationContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function TermsAgreementForm() {
  const router = useRouter();
  const { setTermsAgreed } = useRegistration();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TermsAgreementFormData>({
    resolver: zodResolver(termsAgreementFormSchema),
    defaultValues: {
      agreedToTerms: false,
    },
  });

  const onSubmit = async (data: TermsAgreementFormData) => {
    setIsLoading(true);
    try {
      setTermsAgreed(data.agreedToTerms);
      router.push("/register/plan");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>会員規約</CardTitle>
        <CardDescription>
          IK ALUMNI CGT サポーターズクラブの会員規約をお読みいただき、同意の上でご登録ください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">第1条（会員）</h3>
              <p className="text-muted-foreground">
                本規約における「会員」とは、本規約に同意の上、IK ALUMNI CGT サポーターズクラブ（以下「本クラブ」といいます）への入会手続きを完了し、本クラブより会員としての資格を付与された方をいいます。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">第2条（会員の義務）</h3>
              <p className="text-muted-foreground">
                会員は、本規約および本クラブが別途定める規則を遵守するものとします。会員は、登録情報に変更があった場合、速やかに本クラブに届け出るものとします。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">第3条（会費）</h3>
              <p className="text-muted-foreground">
                会員は、本クラブが定める会費を、指定する方法により支払うものとします。会費の金額およびプランは、本クラブのウェブサイトに掲載するものとします。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">第4条（退会）</h3>
              <p className="text-muted-foreground">
                会員は、本クラブ所定の手続きにより、いつでも退会することができます。退会時の会費の返金は行いません。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">第5条（個人情報の取り扱い）</h3>
              <p className="text-muted-foreground">
                本クラブは、会員の個人情報を、別途定めるプライバシーポリシーに従い、適切に管理します。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">第6条（禁止事項）</h3>
              <p className="text-muted-foreground">
                会員は、以下の行為を行ってはなりません：
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                <li>本クラブの運営を妨げる行為</li>
                <li>他の会員や第三者に迷惑をかける行為</li>
                <li>法令に違反する行為</li>
                <li>公序良俗に反する行為</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">第7条（規約の変更）</h3>
              <p className="text-muted-foreground">
                本クラブは、必要に応じて本規約を変更することができます。変更後の規約は、本クラブのウェブサイトに掲載した時点より効力を生じるものとします。
              </p>
            </section>
          </div>
        </ScrollArea>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <FormField
              control={form.control}
              name="agreedToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      上記の会員規約に同意します
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-between px-0">
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => router.push("/signup")}
              >
                戻る
              </Button>
              <Button type="submit" className="min-h-11" disabled={isLoading}>
                {isLoading ? "処理中..." : "同意して次へ"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
