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

async function writeMetadata(metadata: MetadataStore): Promise<void> {
  await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2), "utf-8");
}

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "缺少简历ID" },
        { status: 400 }
      );
    }
    
    const metadata = await readMetadata();
    
    const resumeIndex = metadata.resumes.findIndex((r) => r.id === id);
    
    if (resumeIndex === -1) {
      return NextResponse.json(
        { success: false, error: "简历不存在" },
        { status: 404 }
      );
    }
    
    metadata.resumes.forEach((resume) => {
      resume.isActive = resume.id === id;
    });
    
    await writeMetadata(metadata);
    
    return NextResponse.json({
      success: true,
      message: "已设置为默认简历",
      resumes: metadata.resumes,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "设置默认简历失败" },
      { status: 500 }
    );
  }
}
