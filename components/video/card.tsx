interface VideoCardProps {
  videoUrl: string;
  title: string;
}

export function VideoCard({ videoUrl, title }: VideoCardProps) {
  // YouTube URLから動画IDを抽出
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?\/]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="flex flex-col items-start gap-[20px] md:gap-[30px] w-full max-w-full">
      <div className="relative w-full aspect-video max-w-[320px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] mx-auto">
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg"
          src={getYouTubeEmbedUrl(videoUrl)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="text-sm md:text-base w-full text-center">{title}</div>
    </div>
  );
}
