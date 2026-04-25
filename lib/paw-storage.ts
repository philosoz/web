import { promises as fs } from "fs";
import path from "path";
import { kv } from "@vercel/kv";

const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "paw-stats.json");
const KV_KEY = "paw_count";

async function getLocalCount(): Promise<number> {
  try {
    const data = await fs.readFile(LOCAL_DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return typeof parsed.count === "number" ? parsed.count : 142;
  } catch {
    return 142;
  }
}

async function setLocalCount(count: number): Promise<void> {
  try {
    await fs.writeFile(
      LOCAL_DATA_FILE,
      JSON.stringify({ count, lastUpdated: new Date().toISOString() })
    );
  } catch (err) {
    console.error("[PawStats] Failed to write local file:", err);
  }
}

function isVercelKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getPawCount(): Promise<number> {
  if (isVercelKvConfigured()) {
    try {
      const count = await kv.get<number>(KV_KEY);
      if (typeof count === "number") {
        return count;
      }
    } catch (err) {
      console.error("[PawStats] Vercel KV get failed:", err);
    }
  }

  return await getLocalCount();
}

export async function incrementPawCount(): Promise<number> {
  if (isVercelKvConfigured()) {
    try {
      const count = await kv.get<number>(KV_KEY);
      const currentCount = typeof count === "number" ? count : await getLocalCount();
      const newCount = currentCount + 1;

      await kv.set(KV_KEY, newCount);
      return newCount;
    } catch (err) {
      console.error("[PawStats] Vercel KV increment failed:", err);
    }
  }

  const current = await getLocalCount();
  const newCount = current + 1;
  await setLocalCount(newCount);
  return newCount;
}