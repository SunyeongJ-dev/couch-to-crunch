"use client";

import React from "react";
import VideoGrid from "./ui/video-grid";
import SideBar from "./ui/sidebar";
import { videos } from "./lib/placeholder-data";

type FilterState = {
  selectedTags: string[];
};

export default function Home() {
  const [filters, setFilters] = React.useState<FilterState>({
    selectedTags: [],
  });

  const filteredVideos = videos.filter((video) => {
    if (filters.selectedTags.length === 0) return true;

    return filters.selectedTags.every((tag) => video.tags.includes(tag));
  });
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar value={filters} onChange={setFilters} />
      <main className="fixed top-16 left-0 right-0 bottom-0 sm:left-56 overflow-y-auto p-8">
        <VideoGrid videos={filteredVideos} />
      </main>
    </div>
  );
}
