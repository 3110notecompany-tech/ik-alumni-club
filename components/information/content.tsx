import { Contents } from "@/components/contents/content";

export function InformationContents({}: {}) {
  return (
    <Contents
      title="INFORMATION"
      items={[{ title: "次回のイベント案内", date: "2025/10/15" }]}
    />
  );
}
