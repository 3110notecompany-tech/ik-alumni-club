import { ContentsHeader } from "@/components/contents/contents-header";

export function AboutSection() {
  return (
    <section className="container mx-auto mb-16 md:mb-32">
      <ContentsHeader title="PROFILE" viewAllHref="#" viewAllText="VIEW MORE" />
      <div className="mx-auto text-left mt-[60px]">
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
  );
}
