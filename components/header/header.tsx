"use client";

import Image from "next/image";
import logo from "./logo.png";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { HamburgerMenuContent } from "./hamburger-menu-content";

export function Header() {
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
            <HamburgerMenuContent />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
