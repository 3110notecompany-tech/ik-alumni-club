import { setLocale } from "@/app/web/i18n/set-locale";
import { getTranslations } from "next-intl/server";
import { Contents } from "@/components/contents/content";
import { InformationContents } from "@/components/information/content";
import { BlogContents } from "@/components/blog/content";
import { NewsLettersContents } from "@/components/newsletters/content";
import { ScheduleContents } from "@/components/shedule/content";
import Image from "next/image";
import heroBg from "./hero-bg.jpg";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await setLocale(params);
  const t = await getTranslations("HomePage");

  return (
    <div className="font-sans max-w-full">
      <div className="relative w-full h-screen -mt-35 mb-32">
        <Image
          src={heroBg}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <main className="container mx-auto px-4">
        <div className="mb-32">
          <InformationContents />
        </div>
        <div className="mb-32">
          <ScheduleContents />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-15 mb-32">
          <BlogContents />
          <NewsLettersContents />
        </div>
      </main>
    </div>
  );
}
