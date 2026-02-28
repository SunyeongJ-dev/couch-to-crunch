// app/(home)/page.tsx
"use client";

import { useState, useEffect } from "react";
import VideoGrid from "@/app/ui/video-grid";
import SideBar from "@/app/ui/sidebar";
import { getDurationCategory } from "@/app/lib/video-utils";
import type { FilterState } from "@/app/ui/filter";
import type { VideoData } from "@/app/lib/types";
import VideoGridSkeleton from "@/app/ui/video-grid-skeleton";
import { useSidebar } from "@/app/providers/sidebar-context";

export default function Home() {
  // Local state for filters with default values.
  const defaultFilters: FilterState = {
    sort: "newest",
    level: undefined,
    types: [],
    duration: undefined,
  };
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const { isCollapsed } = useSidebar();

  // Local state for videos and loading status
  const [fetchedVideos, setFetchedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch videos from the database when the component mounts.
  // The API route /api/videos returns the cached videos that were seeded using the /api/seed route.
  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data: VideoData[]) => setFetchedVideos(data))
      .finally(() => setLoading(false));
  }, []);

  // We apply the filters to the list of videos.
  // This includes filtering by level, type, and duration, as well as sorting by either newest or most viewed.
  const videos: VideoData[] = fetchedVideos;
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

  // After filtering, we sort the videos based on the selected sort option.
  // If "most_viewed" is selected, we sort by view count in descending order.
  // If "newest" is selected, we sort by published date in descending order.
  const sorted = [...filtered].sort((a, b) => {
    if (filters.sort === "most_viewed") {
      return b.viewCount - a.viewCount;
    }
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });

  return (
    <>
      <div
        className={`min-h-screen pt-12 flex flex-col items-start sm:flex-row sm:pt-0 ${isCollapsed ? "sm:pl-16" : "sm:pl-56"}`}
      >
        {/* Pass the filter state and handlers to the SideBar component, which allows the user to update the filters. */}
        <SideBar
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />
        <div className="flex flex-col w-full">
          {loading ? <VideoGridSkeleton /> : <VideoGrid videos={sorted} />}
        </div>
        <div className="h-8" />
      </div>
    </>
  );
}
