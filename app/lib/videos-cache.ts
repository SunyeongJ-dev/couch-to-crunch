import fs from "node:fs/promises";
import path from "node:path";
import type { CachedVideo } from "./types";

export async function readVideosCache(): Promise<CachedVideo[]> {
  const filePath = path.join(process.cwd(), "app", "lib", "videos-cache.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as CachedVideo[];
}
