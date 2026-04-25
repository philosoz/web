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

async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
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

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    await ensureDir(UPLOAD_DIR);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "没有文件上传" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "只支持 PDF、Word、图片文件" },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "文件大小不能超过 10MB" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const uuid = crypto.randomUUID();
    const originalExt = path.extname(file.name).toLowerCase();
    const allowedExts = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    
    if (!allowedExts.includes(originalExt)) {
      return NextResponse.json(
        { success: false, error: "不支持的文件扩展名" },
        { status: 400 }
      );
    }
    
    const fileName = `${timestamp}-${uuid}${originalExt}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const metadata = await readMetadata();
    
    metadata.resumes.forEach(r => r.isActive = false);

    const resume: ResumeMetadata = {
      id: generateId(),
      url: `/resume/${fileName}`,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      isActive: true,
    };

    metadata.resumes.push(resume);
    await writeMetadata(metadata);

    return NextResponse.json({
      success: true,
      url: resume.url,
      fileName: resume.fileName,
      uploadedAt: resume.uploadedAt,
      id: resume.id,
      message: "简历上传成功！",
    });
  } catch (error) {
    console.error("上传失败:", error);
    return NextResponse.json(
      { success: false, error: "上传失败，请重试" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
