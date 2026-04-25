import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  try {
    const metadata = await readMetadata();

    const activeResume = metadata.resumes.find((r) => r.isActive === true);

    if (!activeResume) {
      return NextResponse.json({
        success: false,
        error: "没有找到当前简历",
        resume: null,
      });
    }

    return NextResponse.json({
      success: true,
      resume: activeResume,
    });
  } catch (error) {
    console.error("获取当前简历失败:", error);
    return NextResponse.json(
      { success: false, error: "获取当前简历失败" },
      { status: 500 }
    );
  }
}
