// app/watch/[id]/watch-client.tsx

// "use client" is a directive that tells Next.js to treat this file as a client component,
// allowing us to use React hooks and browser APIs like localStorage.
"use client";

import { useState } from "react";
import type { VideoData } from "../../lib/types";

// This key is used to store the list of saved video Ids in localStorage.
const SAVED_VIDEOS_KEY = "saved_videos";

// Loads saved video Ids from localStorage.
export function loadSavedVideos(): string[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(SAVED_VIDEOS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export default function WatchClient({ video }: { video: VideoData }) {
  const [savedIds, setSavedIds] = useState<string[]>(() => loadSavedVideos());
  const [expanded, setExpanded] = useState(false);
  const saved = savedIds.includes(video.youtubeId);

  // Toggles the saved state of the video.
  function toggleSave() {
    if (saved) {
      // Creates a new array without the current video ID to avoid mutating state directly.
      const newIds = savedIds.filter((id) => id !== video.youtubeId);
      localStorage.setItem(SAVED_VIDEOS_KEY, JSON.stringify(newIds));
      setSavedIds(newIds);
    } else {
      // Adds the Id to existing savedIds array.
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

          {/* Save Button */}
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
          <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
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

        {/* Show More Button */}
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
