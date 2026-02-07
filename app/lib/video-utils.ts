import { DurationOption } from "../ui/filter";

export function parseViewCount(viewCount: string): number {
  const s = viewCount.toLowerCase().replace("views", "").trim();
  const num = parseFloat(s);
  if (Number.isNaN(num)) return 0;
  if (s.includes("m")) return Math.round(num * 1_000_000);
  if (s.includes("k")) return Math.round(num * 1_000);
  return Math.round(num);
}

export function parseUploadTimeToDays(uploadTime: string): number {
  const s = uploadTime.toLowerCase().trim();
  const num = parseInt(s, 10);
  if (Number.isNaN(num)) return 9999;

  if (s.includes("day")) return num;
  if (s.includes("week")) return num * 7;
  if (s.includes("month")) return num * 30;
  return 9999;
}

export function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(":").map((p) => Number(p));

  if (parts.some((n) => Number.isNaN(n))) return 0;

  if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    return hh * 3600 + mm * 60 + ss;
  }

  if (parts.length === 2) {
    const [mm, ss] = parts;
    return mm * 60 + ss;
  }

  if (parts.length === 1) return parts[0];

  return 0;
}

export function getDurationCategory(seconds: number): DurationOption {
  if (seconds < 20 * 60) return "<20min";
  if (seconds < 30 * 60) return "20-30min";
  if (seconds < 45 * 60) return "30-45min";
  return "45+min";
}
