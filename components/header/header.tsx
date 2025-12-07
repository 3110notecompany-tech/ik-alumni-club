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
import { User, LogOut } from "lucide-react";

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
    <header className="fixed top-0 z-50 w-full h-[140px]">
      <div className="container max-w-full h-full flex items-center justify-between">
        {/* ロゴ */}
        <Image
          src={logo}
          alt=""
          width={100}
          height={100}
          placeholder="blur"
          className="w-[80px] h-auto md:w-[100px] object-contain dark:brightness-[0.2] dark:grayscale"
        />

        {/* ハンバーガーメニュー（全画面サイズ） */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="メニューを開く"
              className="w-[70px] h-[70px] rounded-full border-1 border-red-500 bg-white hover:bg-white flex flex-col gap-1.5 items-center justify-center"
            >
              <span className="w-6 h-0.5 bg-red-500"></span>
              <span className="w-6 h-0.5 bg-red-500"></span>
              <span className="w-6 h-0.5 bg-red-500"></span>
            </Button>
          </SheetTrigger>
          <SheetContent className="!w-[calc(100vw-40px)] !max-w-full !left-[20px] !right-[20px] !top-[20px] !h-[calc(100vh-40px)] [&]:data-[state=open]:!fade-in-0 [&]:data-[state=closed]:!fade-out-0 [&]:data-[state=open]:!slide-in-from-right-0 [&]:data-[state=closed]:!slide-out-to-right-0">
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
