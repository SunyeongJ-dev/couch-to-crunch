// app/ui/video-card.tsx
import Image from "next/image";
import Link from "next/link";
import {
  formatDurationFromSeconds,
  formatPublishedAgo,
  formatViewCountShort,
} from "../lib/video-utils";
import type { VideoData } from "../lib/types";

// The VideoCard component receives a single video object as a prop.
export default function VideoCard({ video }: { video: VideoData }) {
  return (
    // Next.js Link enables client-side navigation and prefetching.
    // Client-side navigation means the app moves to another page without a full reload, creating a smoother user experience.
    <Link href={`/watch/${video.id}`} className="block">
      <div className="w-full bg-sub-background rounded-lg shadow-md overflow-hidden">
        <div className="relative pb-[56.25%]">
          {/* Next.js Image optimizes size, loading, and format automatically. */}
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
            <h3
              className="text-base md:text-lg font-semibold mb-1 line-clamp-2"
              title={video.title}
            >
              {video.title}
            </h3>
            <p
              className="font-medium text-text-500 text-sm"
              title={video.channel}
            >
              {video.channel}
            </p>
          </div>
          <div className="mt-1 flex justify-between">
            <p className="text-text-500 text-xs mt-1">
              {/* format data for UI display using utility functions */}
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
