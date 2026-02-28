// app/saved/page.tsx
"use client";

import { useState, useEffect } from "react";
import VideoGrid from "../ui/video-grid";
import type { VideoData } from "../lib/types";
import useSavedVideo from "@/app/lib/hooks/useSavedVideo";
import VideoGridSkeleton from "../ui/video-grid-skeleton";

export default function SavedPage() {
  const { videoIds, isReady } = useSavedVideo("");
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);

  // Whenever the list of saved video IDs changes, we need to fetch their details to display them.
  useEffect(() => {
    // If there are no saved video IDs, we can skip the fetch and just set loading to false.
    async function load() {
      if (videoIds.length === 0) {
        setVideos([]);
        return;
      }

      setLoading(true);
      // Calls /api/videos GET route with ids query to fetch only videos with the specified IDs.
      const res = await fetch("/api/videos?ids=" + videoIds.join(","));
      const data = (await res.json()) as VideoData[];
      setVideos(data);
      setLoading(false);
    }

    load();
  }, [videoIds]);

  if (!isReady || loading) {
    return (
      <div className="flex w-full flex-col max-w-7xl mx-auto px-4 pt-2 pb-6 sm:px-8">
        <h1 className="text-2xl font-bold mb-8">Saved Videos</h1>
        <VideoGridSkeleton />
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col max-w-7xl mx-auto px-4 pt-2 pb-6 sm:px-8">
      <h1 className="text-2xl font-bold pb-3 mb-8 border-b-2 border-primary">
        Saved Videos
      </h1>
      {videoIds.length === 0 ? (
        <p className="text-text-500">No saved videos yet.</p>
      ) : (
        <VideoGrid
          videos={videos?.filter((video) => videoIds.includes(video.id)) || []}
        />
      )}
    </div>
  );
}
