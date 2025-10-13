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
      <div className="container max-w-full py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* ��hSNS���� */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src={logo}
              alt="IK Alumni Club Logo"
              width={80}
              height={80}
              className="dark:brightness-[0.2] dark:grayscale mb-4"
            />
            <div className="flex gap-4 items-center">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Image src={xBlack} alt="X (Twitter)" height={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Image src={instagramBlack} alt="Instagram" height={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
              </Link>
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <Image src={youtubeBlack} alt="YouTube" height={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
              </Link>
              <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                <Image src={tiktokBlack} alt="TikTok" height={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* �󯻯���1 */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-lg mb-4">{t("about")}</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="hover:text-brand transition-colors">
                {t("aboutUs")}
              </Link>
              <Link href="/" className="hover:text-brand transition-colors">
                {t("mission")}
              </Link>
              <Link href="/" className="hover:text-brand transition-colors">
                {t("team")}
              </Link>
            </nav>
          </div>

          {/* �󯻯���2 */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-lg mb-4">{t("resources")}</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="hover:text-brand transition-colors">
                {t("blog")}
              </Link>
              <Link href="/" className="hover:text-brand transition-colors">
                {t("newsletters")}
              </Link>
              <Link href="/" className="hover:text-brand transition-colors">
                {t("contact")}
              </Link>
            </nav>
          </div>
        </div>

        {/* :�� */}
        <div className="border-t my-6" />

        {/* ����� */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IK Alumni Club. {t("allRightsReserved")}</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-brand transition-colors">
              {t("privacyPolicy")}
            </Link>
            <Link href="/" className="hover:text-brand transition-colors">
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
