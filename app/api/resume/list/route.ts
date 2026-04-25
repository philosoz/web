import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "resume");
const METADATA_FILE = path.join(UPLOAD_DIR, ".metadata.json");

interface ResumeMetadata {
  id: string;
  url: string;
  fileName: string;
  uploadedAt: string;
  isActive: boolean;
}

interface MetadataStore {
  resumes: ResumeMetadata[];
}

async function readMetadata(): Promise<MetadataStore> {
  try {
    const data = await fs.readFile(METADATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { resumes: [] };
  }
}

export async function GET() {
  try {
    const metadata = await readMetadata();
    return NextResponse.json({ resumes: metadata.resumes });
  } catch {
    return NextResponse.json(
      { error: "获取简历列表失败" },
      { status: 500 }
    );
  }
}
