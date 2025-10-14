"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import coverImage from "./login-form-cover.jpg"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authClient.signIn.email({
        email,
        password,
      });

      console.log("ログイン成功");
      router.push("/mypage");
    } catch (error: any) {
      console.error("ログインエラー:", error);
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      await authClient.signIn.anonymous();
      console.log("ゲストログイン成功");
      router.push("/mypage");
    } catch (error) {
      console.error("ゲストログインエラー:", error);
      setError("ゲストログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleEmailLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">ようこそ</h1>
                <p className="text-muted-foreground text-balance">
                  IK同窓会クラブにログイン
                </p>
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">パスワード</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "ログイン中..." : "ログイン"}
              </Button>
              <div className="text-center text-sm">
                アカウントをお持ちでないですか?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  登録
                </Link>
              </div>
              <Separator />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGuestLogin}
                disabled={isLoading}
              >
                ゲストでログイン
              </Button>
            </div>
          </form>
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
  )
}
