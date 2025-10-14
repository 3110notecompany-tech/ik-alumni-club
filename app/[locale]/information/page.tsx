import { InformationContents } from "@/components/information/content";

export default async function InformationPage({}: {}) {
  return (
    <div className="container max-w-full items-center justify-between pt-10 pb-32">
      <InformationContents />
    </div>
  );
}
