export type SortOption = "newest" | "most_viewed";
export type LevelOption = "beginner" | "intermediate" | "advanced";
export type TypeOption =
  | "cardio"
  | "strength"
  | "hiit"
  | "yoga"
  | "stretching"
  | "walking";
export type DurationOption = "<20min" | "20-30min" | "30-45min" | "45+min";

export type CachedVideo = {
  youtubeId: string;
  title: string;
  channel: string;
  viewCount: number;
  publishedAt: string;
  durationSec: number;
  description: string;
  thumbnail: string;
  tags: string[];
};
