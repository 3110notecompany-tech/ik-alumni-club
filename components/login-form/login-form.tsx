"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import coverImage from "./login-form-cover.jpg"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">ようこそ</h1>
                <p className="text-muted-foreground text-balance">
                  IK同窓会クラブにログイン
                </p>
              </div>
              <Button onClick={(e) => {
                e.preventDefault();
                authClient.signIn.anonymous().then(() => {
                  console.log("ログイン成功");
                  router.push("/mypage");
                }).catch((error) => {
                  console.error("ログインエラー:", error);
                });
              }}
              type="button" className="w-full">
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
