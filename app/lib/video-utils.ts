// app/lib/video-utils.ts
import { DurationOption } from "../lib/types";

// This file is a module of utility functions related to video data processing and formatting.

// Duration categories for filtering videos by length.
export function getDurationCategory(seconds: number): DurationOption {
  if (seconds < 20 * 60) return "<20min";
  if (seconds < 30 * 60) return "20-30min";
  if (seconds < 45 * 60) return "30-45min";
  return "45+min";
}

// YouTube API returns ISO 8601 duration format, e.g. PT1H2M3S
// This function parses that format and converts it to total seconds.
export function parseIso8601DurationToSeconds(iso: string): number {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;

  const hh = m[1] ? Number(m[1]) : 0;
  const mm = m[2] ? Number(m[2]) : 0;
  const ss = m[3] ? Number(m[3]) : 0;

  return hh * 3600 + mm * 60 + ss;
}

// Shortens large view counts into a more readable format, e.g. 1200 -> "1.2K", 1500000 -> "1.5M"
export function formatViewCountShort(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n < 1000) return `${n}`;

  const units = ["K", "M", "B", "T"];
  let value = n;
  let unitIndex = -1;

  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded}${units[unitIndex]}`;
}

// Formats a duration in seconds into a human-readable string, e.g. 125 -> "2:05", 3605 -> "1:00:05"
export function formatDurationFromSeconds(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);

  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");

  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// Formats an ISO date string into a relative time format, e.g. "2023-01-01T00:00:00Z" -> "2 months ago"
export function formatPublishedAgo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const now = Date.now();
  const diffMs = now - d.getTime();
  if (diffMs < 0) return "just now";

  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}
