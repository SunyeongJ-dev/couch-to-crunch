import { describe, expect, test } from "@jest/globals";
import {
  getDurationCategory,
  parseIso8601DurationToSeconds,
  formatViewCountShort,
  formatDurationFromSeconds,
  formatPublishedAgo,
} from "@/app/lib/video-utils";

describe("getDurationCategory", () => {
  test("categorizes videos by duration", () => {
    expect(getDurationCategory(20 * 60 - 1)).toBe("<20min");
    expect(getDurationCategory(20 * 60)).toBe("20-30min");
    expect(getDurationCategory(30 * 60 - 1)).toBe("20-30min");
    expect(getDurationCategory(30 * 60)).toBe("30-45min");
    expect(getDurationCategory(45 * 60 - 1)).toBe("30-45min");
    expect(getDurationCategory(45 * 60)).toBe("45+min");
  });
});

describe("parseIso8601DurationToSeconds", () => {
  test("parses ISO 8601 duration to seconds", () => {
    expect(parseIso8601DurationToSeconds("PT1H2M3S")).toBe(3723);
    expect(parseIso8601DurationToSeconds("PT30M")).toBe(1800);
  });
});

describe("formatViewCountShort", () => {
  test("formats view counts into short format", () => {
    expect(formatViewCountShort(1200)).toBe("1.2K");
    expect(formatViewCountShort(1500000)).toBe("1.5M");
    expect(formatViewCountShort(0)).toBe("0");
    expect(formatViewCountShort(999)).toBe("999");
  });
});

describe("formatDurationFromSeconds", () => {
  test("formats duration from seconds to human-readable string", () => {
    expect(formatDurationFromSeconds(125)).toBe("2:05");
    expect(formatDurationFromSeconds(3605)).toBe("1:00:05");
    expect(formatDurationFromSeconds(0)).toBe("0:00");
  });
});

describe("formatPublishedAgo", () => {
  test("formats published date into relative time format", () => {
    const now = new Date();
    const twoMonthsAgo = new Date(
      now.getTime() - 60 * 24 * 60 * 60 * 1000,
    ).toISOString();
    expect(formatPublishedAgo(twoMonthsAgo)).toBe("2 months ago");
  });
});
