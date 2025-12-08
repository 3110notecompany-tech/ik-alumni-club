"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import xBlack from "../sns-icon/x-black.png";
import instagramBlack from "../sns-icon/instagram-black.png";
import youtubeBlack from "../sns-icon/youtube-black.png";
import tiktokBlack from "../sns-icon/tiktok-black.png";
import logo from "./logo.png";
import supportersLogo from "@/app/[locale]/(main)/supporters/top_supporter's.jpg";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { User, LogOut } from "lucide-react";

export function HamburgerMenuContent() {
  const t = useTranslations("Header");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="flex flex-col md:grid md:grid-cols-2 h-full w-full rounded-none md:rounded-[10px] overflow-y-auto md:overflow-hidden">
      {/* 上（スマホ）/ 左（PC）: メインメニュー（白背景・赤字） */}
      <div className="bg-white p-20 flex flex-col gap-4 flex-shrink-0 md:h-full">
        {/* ロゴ */}
        <div className="mb-4 flex justify-center">
          <Image src={logo} alt="IK ALUMNI CGT" width={200} height={112} className="h-auto" />
        </div>
        <Link href="/" className="text-base font-medium text-red-500 hover:underline transition-colors">
          {t("home")}
        </Link>
        <Link href="/information" className="text-base font-medium text-red-500 hover:underline transition-colors">
          {t("information")}
        </Link>
        <Link href="/schedule" className="text-base font-medium text-red-500 hover:underline transition-colors">
          {t("schedule")}
        </Link>
        <Link href="/video" className="text-base font-medium text-red-500 hover:underline transition-colors">
          {t("video")}
        </Link>
        <Link href="/blog" className="text-base font-medium text-red-500 hover:underline transition-colors">
          {t("blog")}
        </Link>
        <Link href="/newsletter" className="text-base font-medium text-red-500 hover:underline transition-colors">
          {t("newsletters")}
        </Link>
        <Link href="/contact" className="text-base font-medium text-red-500 hover:underline transition-colors">
          {t("contact")}
        </Link>

        {/* SNSアイコン */}
        <div className="flex gap-4 mt-4">
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
      </div>

      {/* 下（スマホ）/ 右（PC）: サポーターズクラブ（青系背景） */}
      <div className="bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-500 p-20 flex flex-col gap-4 flex-grow md:h-full">
        {/* サポーターズクラブロゴ */}
        <div className="mb-4 flex justify-center">
          <Image src={supportersLogo} alt="Supporter's Club" width={200} height={112} className="h-auto" />
        </div>
        {session?.user ? (
          <>
            <Link href="/mypage" className="w-full">
              <Button variant="outline" className="w-full min-h-11 bg-white/20 border-white text-white hover:bg-white/30">
                <User className="h-4 w-4 mr-2" />
                {t("mypage")}
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full min-h-11 bg-white/20 border-white text-white hover:bg-white/30"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </>
        ) : (
          <>
            <Link href="/supporters" className="w-full">
              <Button className="w-full min-h-11 bg-white text-blue-500 hover:bg-white/90">
                {t("joinUs")}
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full min-h-11 bg-white/20 border-white text-white hover:bg-white/30">
                {t("login")}
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
