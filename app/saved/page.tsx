"use client";

import { useState, useEffect } from "react";
import VideoGrid from "../ui/video-grid";
import { loadSavedVideos } from "../watch/[id]/watch-client";
import type { FetchedVideo } from "../lib/types";

export default function SavedPage() {
  const [ids, setIds] = useState<string[]>([]);
  const [videos, setVideos] = useState<FetchedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIds(loadSavedVideos());
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
      // Fetch the video details for the saved video IDs. The API route /api/videos accepts a comma-separated list of video IDs and returns their details.
      setLoading(true);
      const res = await fetch("/api/videos?ids=" + ids.join(","));
      const data = (await res.json()) as FetchedVideo[];
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
      ) : videos.filter((video) => ids.includes(video.youtubeId)).length ===
        0 ? (
        <p className="text-text-500">No saved videos yet.</p>
      ) : (
        <VideoGrid
          videos={videos.filter((video) => ids.includes(video.youtubeId))}
        />
      )}
    </div>
  );
}
