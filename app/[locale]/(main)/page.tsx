import { setLocale } from "@/app/web/i18n/set-locale";
import { InformationContents } from "@/components/information/content";
import { BlogContents } from "@/components/blog/content";
import { NewsLettersContents } from "@/components/newsletters/content";
import { ScheduleContents } from "@/components/shedule/content";
import Image from "next/image";
import heroBg from "./hero-bg.jpg";
import { VideoContents } from "@/components/video/content";

export const dynamic = 'force-dynamic';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);

  return (
    <div className="font-sans max-w-full">
      <div className="relative w-full mb-16 md:mb-32">
        <Image
          src={heroBg}
          alt="Hero Background"
          className="w-full h-auto"
          priority
        />
      </div>
      <main className="container mx-auto">
        <div className="mb-16 md:mb-32">
          <InformationContents />
        </div>
        <div className="mb-16 md:mb-32">
          <ScheduleContents />
        </div>
        <div className="mb-16 md:mb-32">
          <VideoContents />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-15 mb-16 md:mb-32">
          <BlogContents />
          <NewsLettersContents />
        </div>
      </main>
    </div>
  );
}
