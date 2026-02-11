// app/saved/page.tsx
"use client";

import { useState, useEffect } from "react";
import VideoGrid from "../ui/video-grid";
import type { VideoData } from "../lib/types";

export default function SavedPage() {
  const [ids, setIds] = useState<string[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem("saved_videos") || "[]");
    setIds(savedIds);
  }, []);
  // Whenever the list of saved video IDs changes, we need to fetch their details to display them.
  useEffect(() => {
    // If there are no saved video IDs, we can skip the fetch and just set loading to false.
    async function load() {
      if (ids.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      // Calls /api/videos GET route with ids query to fetch only videos with the specified IDs.
      const res = await fetch("/api/videos?ids=" + ids.join(","));
      const data = (await res.json()) as VideoData[];
      setVideos(data);
      setLoading(false);
    }

    load();
  }, [ids]);

  return (
    <div className="flex w-full flex-col max-w-7xl mx-auto px-4 pt-2 pb-6 sm:px-8">
      <h1 className="text-2xl font-bold mb-8">Saved Videos</h1>
      {loading ? (
        <p className="text-text-500">Loading saved videos...</p>
      ) : /* Defensive filter in case ids and videos get out of sync. */
      videos.filter((video) => ids.includes(video.youtubeId)).length === 0 ? (
        <p className="text-text-500">No saved videos yet.</p>
      ) : (
        <VideoGrid
          videos={videos.filter((video) => ids.includes(video.youtubeId))}
        />
      )}
    </div>
  );
}
