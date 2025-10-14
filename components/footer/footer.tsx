"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../header/logo.png";
import xBlack from "../sns-icon/x-black.png";
import instagramBlack from "../sns-icon/instagram-black.png";
import youtubeBlack from "../sns-icon/youtube-black.png";
import tiktokBlack from "../sns-icon/tiktok-black.png";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full border-t bg-background mt-32">
      <div className="pt-[50px]">
        <div className="flex gap-4 items-center justify-center max-w-full px-0 mb-[32px]">
          <Image src={xBlack} alt="" height={24} />
          <Image src={instagramBlack} alt="" height={24} />
          <Image src={youtubeBlack} alt="" height={24} />
          <Image src={tiktokBlack} alt="" height={24} />
        </div>
        <div className="flex flex-wrap gap-[48px] items-center justify-center max-w-full px-[92px] mb-[50px]">
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
          <div className="header-text whitespace-nowrap">お支払い</div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-full">
          <div className="header-text whitespace-nowrap py-[16px]">
            ©️IK ALUMNI CGT
          </div>
        </div>
      </div>
    </footer>
  );
}
