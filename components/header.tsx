"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, Dog } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="font-bold text-xl">IK Alumni Club</div>
        </Link>

        {/* デスクトップメニュー */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/events">Events</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/members">Members</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/pets">ペット一覧</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* マイページボタンとログアウト */}
        <div className="flex items-center gap-2">
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

          {/* モバイルメニュー */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">メニュー</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/about" className="text-lg font-medium">
                  About
                </Link>
                <Link href="/events" className="text-lg font-medium">
                  Events
                </Link>
                <Link href="/members" className="text-lg font-medium">
                  Members
                </Link>
                <Link
                  href="/pets"
                  className="text-lg font-medium flex items-center gap-2"
                >
                  <Dog className="h-5 w-5" />
                  ペット一覧
                </Link>
                {session?.user && (
                  <>
                    <Link
                      href="/mypage"
                      className="text-lg font-medium flex items-center gap-2"
                    >
                      <User className="h-5 w-5" />
                      マイページ
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-lg font-medium flex items-center gap-2 justify-start p-0 h-auto"
                    >
                      <LogOut className="h-5 w-5" />
                      ログアウト
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
