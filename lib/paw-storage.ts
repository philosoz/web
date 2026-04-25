/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabase } from "./supabase";

const STATS_TABLE = "paw_stats";
const STATS_ID = "paw_counter";

let cachedCount = 128;

function isSupabaseConfigured(): boolean {
  return !!getSupabase();
}

export async function getPawCount(): Promise<number> {
  if (!isSupabaseConfigured()) {
    console.log("[PawStats] Supabase not configured, returning cached value");
    return cachedCount;
  }

  try {
    const supabase = getSupabase();
    if (!supabase) return cachedCount;

    const { data } = await supabase
      .from(STATS_TABLE)
      .select("count")
      .eq("id", STATS_ID)
      .single() as { data: { count: number } | null };

    if (data?.count) {
      cachedCount = data.count;
    }

    return cachedCount;
  } catch (err) {
    console.error("[PawStats] Exception fetching count:", err);
    return cachedCount;
  }
}

export async function incrementPawCount(): Promise<number> {
  if (!isSupabaseConfigured()) {
    console.log("[PawStats] Supabase not configured, using local increment");
    cachedCount += 1;
    return cachedCount;
  }

  try {
    const supabase = getSupabase();
    if (!supabase) return cachedCount;

    const { data: currentData } = await supabase
      .from(STATS_TABLE)
      .select("count")
      .eq("id", STATS_ID)
      .single() as { data: { count: number } | null };

    const currentCount = currentData?.count ?? 128;
    const newCount = currentCount + 1;

    await supabase
      .from(STATS_TABLE)
      .upsert({
        id: STATS_ID,
        count: newCount,
        updated_at: new Date().toISOString(),
      } as any, {
        onConflict: "id",
      } as any);

    cachedCount = newCount;
    return newCount;
  } catch (err) {
    console.error("[PawStats] Exception incrementing count:", err);
    cachedCount += 1;
    return cachedCount;
  }
}