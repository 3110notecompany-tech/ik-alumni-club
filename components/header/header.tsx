"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "./logo.png";
import divider from "./line.svg";
import xBlack from "../sns-icon/x-black.png";
import instagramBlack from "../sns-icon/instagram-black.png";
import youtubeBlack from "../sns-icon/youtube-black.png";
import tiktokBlack from "../sns-icon/tiktok-black.png";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations("Header");

  // ユーザー登録機能実装時に使用
  // const { data: session } = authClient.useSession();

  // const handleLogout = async () => {
  //   await authClient.signOut();
  //   router.push("/");
  //   router.refresh();
  // };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-full flex h-[140px] items-center justify-between">
        {/* ロゴ */}
        <Image
          src={logo}
          alt=""
          width={100}
          height={100}
          placeholder="blur"
          className="dark:brightness-[0.2] dark:grayscale"
        />
        <div className="flex flex-col flex-1">
          <div className="flex gap-6 h-[70px] items-center justify-end">
            <div className="header-text">{t("home")}</div>
            <div className="header-text">{t("information")}</div>
            <div className="header-text">{t("schedule")}</div>
            <div className="header-text">{t("video")}</div>
            <div className="header-text">{t("blog")}</div>
            <div className="header-text">{t("newsletters")}</div>
            <div className="header-text">{t("contact")}</div>
            <Image src={divider} alt="" width={1} height={18} />
            <Image src={xBlack} alt="" height={24} />
            <Image src={instagramBlack} alt="" height={24} />
            <Image src={youtubeBlack} alt="" height={24} />
            <Image src={tiktokBlack} alt="" height={24} />
          </div>
          <div className="flex gap-6 h-[70px] items-center justify-end">
            <Button className="rounded-[50px] bg-brand">{t("joinUs")}</Button>
            <Button variant="outline" className="rounded-[50px] border-brand">{t("login")}</Button>
          </div>
        </div>
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
