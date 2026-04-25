import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "paw-stats.json");
const KV_KEY = "paw_count";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return redis;
}

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

export async function getPawCount(): Promise<number> {
  const client = getRedis();
  if (client) {
    try {
      const count = await client.get<number>(KV_KEY);
      if (typeof count === "number") {
        return count;
      }
    } catch (err) {
      console.error("[PawStats] Upstash get failed:", err);
    }
  }

  return await getLocalCount();
}

export async function incrementPawCount(): Promise<number> {
  const client = getRedis();
  if (client) {
    try {
      const count = await client.get<number>(KV_KEY);
      const currentCount = typeof count === "number" ? count : await getLocalCount();
      const newCount = currentCount + 1;

      await client.set(KV_KEY, newCount);
      return newCount;
    } catch (err) {
      console.error("[PawStats] Upstash increment failed:", err);
    }
  }

  const current = await getLocalCount();
  const newCount = current + 1;
  await setLocalCount(newCount);
  return newCount;
}