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
      <section className="container mx-auto px-4 mb-16 md:mb-32">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl leading-relaxed mb-6">
            2022年に発足した、千葉県内唯一の一般カラーガードチーム。
          </p>
          <p className="text-lg md:text-xl leading-relaxed mb-6">
            チーム名のALUMNIとは「卒業生」という意味で、<br />
            その名の通りメンバーは柏市立柏高等学校（通称：イチカシ）の卒業生で構成されています。
          </p>
          <p className="text-lg md:text-xl leading-relaxed">
            地元柏市でのイベント出演や年度末に行われる自主公演に向けて日々活動しています。
          </p>
        </div>
      </section>
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
