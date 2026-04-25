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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    if (!filename) {
      return NextResponse.json(
        { success: false, error: "缺少文件名" },
        { status: 400 }
      );
    }
    
    const metadata = await readMetadata();
    
    const resumeIndex = metadata.resumes.findIndex((r) => r.url === `/resume/${filename}`);
    
    if (resumeIndex === -1) {
      return NextResponse.json(
        { success: false, error: "简历不存在" },
        { status: 404 }
      );
    }
    
    const filePath = path.join(UPLOAD_DIR, filename);
    
    try {
      await fs.unlink(filePath);
    } catch {
      console.warn(`文件不存在: ${filePath}`);
    }
    
    const wasActive = metadata.resumes[resumeIndex].isActive;
    metadata.resumes.splice(resumeIndex, 1);
    
    if (wasActive && metadata.resumes.length > 0) {
      metadata.resumes[0].isActive = true;
    }
    
    await writeMetadata(metadata);
    
    return NextResponse.json({
      success: true,
      message: "简历已删除",
      resumes: metadata.resumes,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "删除简历失败" },
      { status: 500 }
    );
  }
}
