import { kv } from "@vercel/kv";

export interface PawStats {
  count: number;
  lastUpdated: string;
}

const KV_KEY = "paw:stats";

export async function getPawCount(): Promise<number> {
  try {
    const stats = await kv.get<PawStats>(KV_KEY);
    return stats?.count ?? 128;
  } catch {
    return 128;
  }
}

export async function incrementPawCount(): Promise<number> {
  try {
    const current = await getPawCount();
    const newCount = current + 1;
    await kv.set(KV_KEY, {
      count: newCount,
      lastUpdated: new Date().toISOString(),
    });
    return newCount;
  } catch {
    return 128;
  }
}
