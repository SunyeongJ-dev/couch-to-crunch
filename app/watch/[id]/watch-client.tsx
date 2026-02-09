"use client";

import { useState } from "react";

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

// This key is used to store the list of saved video IDs in local storage.
const SAVED_VIDEOS_KEY = "saved_videos";

// This function loads the list of saved video IDs from local storage. If there are no saved videos, it returns an empty array.
export function loadSavedVideos(): string[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(SAVED_VIDEOS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export default function WatchClient({ video }: { video: VideoProps }) {
  const [savedIds, setSavedIds] = useState<string[]>(() => loadSavedVideos());
  const [expanded, setExpanded] = useState(false);
  const saved = savedIds.includes(video.youtubeId);

  // This function toggles the saved state of the video. If the video is currently saved, it removes it from local storage.
  // If it's not saved, it adds it to local storage. The button text and state are updated accordingly.
  function toggleSave() {
    if (saved) {
      const newIds = savedIds.filter((id) => id !== video.youtubeId);
      localStorage.setItem(SAVED_VIDEOS_KEY, JSON.stringify(newIds));
      setSavedIds(newIds);
    } else {
      const newIds = [...savedIds, video.youtubeId];
      localStorage.setItem(SAVED_VIDEOS_KEY, JSON.stringify(newIds));
      setSavedIds(newIds);
    }
  }

  const descriptionClass = expanded
    ? "whitespace-pre-line"
    : "whitespace-pre-line line-clamp-6";

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
          <button
            onClick={toggleSave}
            className="mt-3 flex w-full items-center justify-center py-1.5 sm:text-sm sm:absolute sm:top-0 sm:right-0 sm:mt-0 sm:h-9 sm:w-24 text-sub-background bg-primary hover:bg-secondary cursor-pointer font-medium rounded-md transition duration-300 ease-in-out"
          >
            {saved ? "Unsave" : "Save"}
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
          <div className="mt-6 p-4 text-sm sm:text-base rounded-xl border border-text-600">
            <p className={`leading-6 ${descriptionClass}`}>
              {video.description}
            </p>
          </div>
        )}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-sm text-primary font-medium cursor-pointer"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
}
