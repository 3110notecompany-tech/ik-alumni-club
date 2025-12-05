import { ContentsHeader } from "@/components/contents/contents-header";
import { ContentsCard } from "@/components/contents/contents-card";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import content1Image from "./content1.jpg";
import content2Image from "./content2.jpg";
import content3Image from "./content3.jpg";

export async function NewContents() {
  const t = await getTranslations("Contents");

  // 仮データ
  const newItems = [
    {
      id: 1,
      title: "News Latter Vol.2",
      date: "2024/01/15",
      imageUrl: content1Image,
      category: "News Letter",
    },
    {
      id: 2,
      title: "柏de吹奏楽Party Video Content",
      date: "2024/01/10",
      imageUrl: content2Image,
      category: "Video",
    },
    {
      id: 3,
      title: "Phot library",
      date: "2024/01/05",
      imageUrl: content3Image,
      category: "Photo",
    },
  ];

  return (
    <div className="flex flex-col text-white">
      <ContentsHeader title="New Content" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-[60px]">
        {newItems.length === 0 ? (
          <p>新着情報はありません</p>
        ) : (
          newItems.map((item) => (
            <Link key={item.id} href={`/new/${item.id}`}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                    {item.category}
                  </h3>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <ContentsCard title={item.title} date={item.date} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
