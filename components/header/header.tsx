"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "./logo.png";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, Dog } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  // ユーザー登録機能実装時に使用
  // const { data: session } = authClient.useSession();

  // const handleLogout = async () => {
  //   await authClient.signOut();
  //   router.push("/");
  //   router.refresh();
  // };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[140px] items-center justify-between">
        {/* ロゴ */}
        <Image
          src={logo}
          alt=""
          width={100}
          height={100}
          placeholder="blur"
          className="dark:brightness-[0.2] dark:grayscale"
        />
        <div className="header-text">TEXT</div>
        {/* マイページボタンとログアウト//ユーザー登録機能実装時に使用 */}
        {/* <div className="flex items-center gap-2">
          {session?.user && (
            <>
              <Link href="/mypage" className="hidden md:block">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">マイページ</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hidden md:block"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">ログアウト</span>
              </Button>
            </>
          )}
        </div> */}
      </div>
    </header>
  );
}
