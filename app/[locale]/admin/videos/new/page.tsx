import { VideoForm } from "@/components/video-form";

export default function NewVideoPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">動画新規作成</h1>
      <VideoForm />
    </div>
  );
}
