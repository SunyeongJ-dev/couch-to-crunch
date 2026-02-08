"use client";

type VideoProps = {
  youtubeId: string;
  title: string;
  channel: string;
  viewCount: number;
  publishedAt: Date;
  durationSec: number;
  description: string;
  thumbnail: string;
  tags: string[];
};

export default function WatchClient({ video }: { video: VideoProps }) {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto bg-sub-background rounded-xl">
      {/* Player */}
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Meta */}
      <div className="mt-4 sm:mt-6">
        <div className="relative text-sm sm:text-base mt-1 sm:pr-32">
          <h1 className="mb-1 text-base sm:text-2xl font-bold">
            {video.title}
          </h1>
          <span className="font-medium text-text-500">{video.channel}</span>
          <button className="mt-3 flex w-full items-center justify-center py-1.5 sm:text-sm sm:absolute sm:top-0 sm:right-0 sm:mt-0 sm:h-9 sm:w-24 text-sub-background bg-primary hover:bg-secondary cursor-pointer font-medium rounded-md transition duration-300 ease-in-out">
            Save
          </button>
        </div>

        <div className="mt-3 text-xs sm:text-sm opacity-80">
          <span>{video.viewCount.toLocaleString()} views</span>
          <span className="mx-2">•</span>
          <span>{video.publishedAt.toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{Math.round(video.durationSec / 60)} min</span>
        </div>

        {/* Tags */}
        {video.tags?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {video.tags.map((t) => (
              <span
                key={t}
                className="text-xs text-sub-background px-2 py-1 rounded-full border border-background bg-accent opacity-90"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {video.description && (
          <div className="mt-6 p-4 text-sm sm:text-base rounded-xl border border-text-600 whitespace-pre-line leading-relaxed">
            {video.description}
          </div>
        )}
      </div>
    </div>
  );
}
