/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from "fs";
import path from "path";
import { getSupabase } from "./supabase";

const STATS_TABLE = "paw_stats";
const STATS_ID = "paw_counter";
const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "paw-stats.json");

async function getLocalCount(): Promise<number> {
  try {
    const data = await fs.readFile(LOCAL_DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return typeof parsed.count === "number" ? parsed.count : 128;
  } catch {
    return 128;
  }
}

async function setLocalCount(count: number): Promise<void> {
  try {
    await fs.writeFile(
      LOCAL_DATA_FILE,
      JSON.stringify({
        count,
        lastUpdated: new Date().toISOString(),
      })
    );
  } catch (err) {
    console.error("[PawStats] Failed to write local file:", err);
  }
}

function isSupabaseConfigured(): boolean {
  const supabase = getSupabase();
  return !!supabase && !!process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export async function getPawCount(): Promise<number> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const { data } = await supabase!
        .from(STATS_TABLE)
        .select("count")
        .eq("id", STATS_ID)
        .single() as { data: { count: number } | null };

      if (data?.count) {
        return data.count;
      }
    } catch (err) {
      console.error("[PawStats] Supabase fetch failed:", err);
    }
  }

  return await getLocalCount();
}

export async function incrementPawCount(): Promise<number> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();

      const { data: currentData } = await supabase!
        .from(STATS_TABLE)
        .select("count")
        .eq("id", STATS_ID)
        .single() as { data: { count: number } | null };

      const currentCount = currentData?.count ?? (await getLocalCount());
      const newCount = currentCount + 1;

      await supabase!
        .from(STATS_TABLE)
        .upsert({
          id: STATS_ID,
          count: newCount,
          updated_at: new Date().toISOString(),
        } as any, {
          onConflict: "id",
        } as any);

      return newCount;
    } catch (err) {
      console.error("[PawStats] Supabase increment failed:", err);
    }
  }

  const current = await getLocalCount();
  const newCount = current + 1;
  await setLocalCount(newCount);
  return newCount;
}