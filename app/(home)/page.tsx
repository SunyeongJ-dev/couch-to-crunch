// app/(home)/page.tsx
"use client";

import React from "react";
import VideoGrid from "../ui/video-grid";
import SideBar from "../ui/sidebar";
import { FilterState } from "../ui/filter";
import { getDurationCategory } from "../lib/video-utils";
import type { CachedVideo } from "../lib/types";

export default function Home() {
  const [filters, setFilters] = React.useState<FilterState>({
    sort: "newest",
    level: undefined,
    types: [],
    duration: undefined,
  });

  // Local state for videos and loading status
  const [videos, setVideos] = React.useState<CachedVideo[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch videos from the database when the component mounts. The API route /api/videos returns the cached videos that were seeded using the /api/seed route.
  React.useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => setVideos(data))
      .finally(() => setLoading(false));
  }, []);

  // We apply the filters to the list of videos. This includes filtering by level, type, and duration, as well as sorting by either newest or most viewed.
  const filtered = videos.filter((v) => {
    if (filters.level && !v.tags.includes(filters.level)) return false;

    if (filters.types.length > 0) {
      const matchAnyType = filters.types.some((t) => v.tags.includes(t));
      if (!matchAnyType) return false;
    }

    if (filters.duration) {
      const category = getDurationCategory(v.durationSec);
      if (category !== filters.duration) return false;
    }

    return true;
  });

  // After filtering, we sort the videos based on the selected sort option. If "most_viewed" is selected, we sort by view count in descending order. If "newest" is selected, we sort by published date in descending order.
  const sorted = [...filtered].sort((a, b) => {
    if (filters.sort === "most_viewed") {
      return b.viewCount - a.viewCount;
    }
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });

  return (
    <div className="h-screen flex">
      <SideBar value={filters} onChange={setFilters} />
      {loading ? (
        <div className="p-8">Loading videos...</div>
      ) : (
        <VideoGrid videos={sorted} />
      )}
      <div className="h-8" />
    </div>
  );
}
