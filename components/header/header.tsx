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
      </div>
    </header>
  );
}
