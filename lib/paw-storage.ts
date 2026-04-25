import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "paw-stats.json");

export interface PawStats {
  count: number;
  lastUpdated: string;
}

async function ensureDataFile(): Promise<void> {
  const dataDir = path.dirname(DATA_FILE);
  
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ count: 128, lastUpdated: new Date().toISOString() }));
  }
}

export async function getPawCount(): Promise<number> {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const stats: PawStats = JSON.parse(data);
    return stats.count;
  } catch {
    return 128;
  }
}

export async function incrementPawCount(): Promise<number> {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const stats: PawStats = JSON.parse(data);
    stats.count += 1;
    stats.lastUpdated = new Date().toISOString();
    await fs.writeFile(DATA_FILE, JSON.stringify(stats));
    return stats.count;
  } catch {
    return 128;
  }
}
