// app/ui/video-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  formatDurationFromSeconds,
  formatPublishedAgo,
  formatViewCountShort,
} from "../lib/video-utils";
import type { VideoData } from "../lib/types";
import useSavedVideo from "../lib/useSavedVideo";
import { useRouter } from "next/navigation";

// The VideoCard component receives a single video object as a prop.
export default function VideoCard({ video }: { video: VideoData }) {
  const { isSaved, saveVideo, removeVideo, isReady } = useSavedVideo(video.id);
  const router = useRouter();

  return (
    <Link href={`/watch/${video.id}`} className="block">
      <div className="relative w-full bg-sub-background rounded-lg shadow-md overflow-hidden">
        {isReady && (
          <button
            className={`absolute top-2 right-2 z-10 w-8 h-8 p-1 rounded-full cursor-pointer bg-primary shadow-md hover:bg-secondary transition duration-200`}
            onClick={(e) => {
              e.preventDefault();
              if (isSaved) {
                removeVideo(video.id);
              } else {
                saveVideo(video.id);
              }
            }}
          >
            <span className="flex text-3xl font-medium text-white leading-3 justify-center items-center mb-1">
              {isSaved ? "-" : "+"}
            </span>
          </button>
        )}
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
              <span
                className="hover:text-primary transition duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/channel/${encodeURIComponent(video.channel)}`);
                }}
              >
                {video.channel}
              </span>
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
