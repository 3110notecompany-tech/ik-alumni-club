"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "./logo.png";
import xBlack from "../sns-icon/x-black.png";
import instagramBlack from "../sns-icon/instagram-black.png";
import youtubeBlack from "../sns-icon/youtube-black.png";
import tiktokBlack from "../sns-icon/tiktok-black.png";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { User, LogOut, Menu } from "lucide-react";

export function Header() {
  const t = useTranslations("Header");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-full flex h-[80px] md:h-[100px] items-center justify-between">
        {/* ロゴ */}
        <Image
          src={logo}
          alt=""
          width={60}
          height={60}
          placeholder="blur"
          className="md:w-[100px] md:h-[100px] dark:brightness-[0.2] dark:grayscale"
        />

        {/* ハンバーガーメニュー（全画面サイズ） */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="メニューを開く">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetTitle className="sr-only">メニュー</SheetTitle>
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-base font-medium hover:underline transition-colors">
                {t("home")}
              </Link>
              <Link href="/information" className="text-base font-medium hover:underline transition-colors">
                {t("information")}
              </Link>
              <Link href="/schedule" className="text-base font-medium hover:underline transition-colors">
                {t("schedule")}
              </Link>
              <Link href="/video" className="text-base font-medium hover:underline transition-colors">
                {t("video")}
              </Link>
              <Link href="/blog" className="text-base font-medium hover:underline transition-colors">
                {t("blog")}
              </Link>
              <Link href="/newsletter" className="text-base font-medium hover:underline transition-colors">
                {t("newsletters")}
              </Link>
              <Link href="/contact" className="text-base font-medium hover:underline transition-colors">
                {t("contact")}
              </Link>

              <Separator className="my-2" />

              {/* SNSアイコン */}
              <div className="flex gap-4 justify-center">
                <a href="https://x.com/ik_alumni_2022" target="_blank" rel="noopener noreferrer">
                  <Image src={xBlack} alt="X (Twitter)" height={24} width={24} />
                </a>
                <a href="https://www.instagram.com/p/DGdTDvBPPuI/" target="_blank" rel="noopener noreferrer">
                  <Image src={instagramBlack} alt="Instagram" height={24} width={24} />
                </a>
                <a href="https://www.youtube.com/@ichikashialumnicgt2562" target="_blank" rel="noopener noreferrer">
                  <Image src={youtubeBlack} alt="YouTube" height={24} width={24} />
                </a>
                <a href="https://www.tiktok.com/@ik_alumni_2022" target="_blank" rel="noopener noreferrer">
                  <Image src={tiktokBlack} alt="TikTok" height={24} width={24} />
                </a>
              </div>

              <Separator className="my-2" />

              {/* ログイン/ログアウトボタン */}
              {session?.user ? (
                <>
                  <Link href="/mypage" className="w-full">
                    <Button variant="outline" className="w-full min-h-11">
                      <User className="h-4 w-4 mr-2" />
                      {t("mypage")}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full min-h-11"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/supporters" className="w-full">
                    <Button className="w-full min-h-11 bg-brand">
                      {t("joinUs")}
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full min-h-11 border-brand">
                      {t("login")}
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
