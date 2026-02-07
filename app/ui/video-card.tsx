import Image from "next/image";
import type { CachedVideo } from "../lib/types";
import Link from "next/link";
import {
  formatDurationFromSeconds,
  formatPublishedAgo,
  formatViewCountShort,
} from "../lib/video-utils";

type VideoCardProps = {
  video: CachedVideo;
};

// The VideoCard component displays a single video's thumbnail, title, channel, view count, published date, and duration.
// It is used in the VideoGrid component to render a grid of videos on the homepage.
export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/watch/${video.youtubeId}`} className="block">
      <div className="w-full bg-sub-background rounded-lg shadow-md overflow-hidden">
        <div className="relative pb-[56.25%]">
          <Image
            src={video.thumbnail}
            alt={video.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
            width={280}
            height={157}
          />
        </div>
        <div className="flex flex-col justify-between sm:min-h-36 p-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
              {video.title}
            </h3>
            <p className="text-text-600 text-sm">{video.channel}</p>
          </div>
          <div className="flex justify-between mt-auto">
            <p className="text-text-500 text-xs mt-1">
              {formatViewCountShort(video.viewCount)} •{" "}
              {formatPublishedAgo(video.publishedAt)}
            </p>
            <p className="text-text-500 text-xs mt-1">
              {formatDurationFromSeconds(video.durationSec)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
