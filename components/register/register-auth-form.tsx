"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import coverImage from "../login-form/login-form-cover.jpg";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupFormSchema } from "@/zod/signup";
import { SignupFormData } from "@/types/signup";
import { toast } from "sonner";
import { useRegistration } from "@/contexts/RegistrationContext";
import { createMemberAfterSignup } from "@/actions/members/create-member";

export function RegisterAuthForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { selectedPlanId, resetRegistration } = useRegistration();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // プランが選択されていない場合はリダイレクト
  if (!selectedPlanId) {
    router.push("/register/plan");
    return null;
  }

  async function onSubmit(data: SignupFormData) {
    try {
      // Better Authでアカウント作成
      const signupResult = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (!signupResult.data?.user?.id) {
        throw new Error("アカウント作成に失敗しました");
      }

      const userId = signupResult.data.user.id;

      // memberレコード作成
      const memberResult = await createMemberAfterSignup(
        userId,
        data.email,
        selectedPlanId ?? undefined
      );

      if (!memberResult.success) {
        throw new Error(memberResult.error || "会員情報の作成に失敗しました");
      }

      toast.success("アカウントが作成されました", {
        description: `${data.name}さん、IK ALUMNI CGT サポーターズクラブへようこそ`,
      });

      // 登録状態をリセット
      resetRegistration();

      form.reset();
      router.push("/dashboard");
    } catch (error) {
      toast.error("エラーが発生しました", {
        description:
          error instanceof Error
            ? error.message
            : "サインアップに失敗しました",
      });
      console.error("サインアップエラー:", error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col items-center text-center mb-6">
                  <h1 className="text-2xl font-bold">アカウント作成</h1>
                  <p className="text-muted-foreground text-balance">
                    IK ALUMNI CGT サポーターズクラブに登録
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>名前</FormLabel>
                      <FormControl>
                        <Input placeholder="山田太郎" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>パスワード</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 min-h-11"
                    onClick={() => router.push("/register/plan")}
                  >
                    戻る
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 min-h-11"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "登録中..." : "登録"}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  すでにアカウントをお持ちですか?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    ログイン
                  </Link>
                </div>
              </form>
            </Form>
          </div>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={coverImage}
              alt=""
              placeholder="blur"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
