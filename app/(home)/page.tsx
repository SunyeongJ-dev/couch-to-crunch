"use client";

import React from "react";
import VideoGrid from "../ui/video-grid";
import SideBar from "../ui/sidebar";
import { videos } from "../lib/placeholder-data";
import { FilterState } from "../ui/filter";
import {
  parseViewCount,
  parseUploadTimeToDays,
  parseDurationToSeconds,
  getDurationCategory,
} from "../lib/video-utils";

export default function Home() {
  const [filters, setFilters] = React.useState<FilterState>({
    sort: "newest",
    level: undefined,
    types: [],
    duration: undefined,
  });

  const filtered = videos.filter((v) => {
    if (filters.level && !v.tags.includes(filters.level)) return false;

    if (filters.types.length > 0) {
      const matchAnyType = filters.types.some((t) => v.tags.includes(t));
      if (!matchAnyType) return false;
    }

    if (filters.duration) {
      const seconds = parseDurationToSeconds(v.duration);
      const category = getDurationCategory(seconds);
      if (category !== filters.duration) return false;
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (filters.sort === "most_viewed") {
      return parseViewCount(b.viewCount) - parseViewCount(a.viewCount);
    }
    return (
      parseUploadTimeToDays(a.uploadTime) - parseUploadTimeToDays(b.uploadTime)
    );
  });

  return (
    <div className="h-screen">
      <SideBar value={filters} onChange={setFilters} />
      <VideoGrid videos={sorted} />
      <div className="h-8" />
    </div>
  );
}
