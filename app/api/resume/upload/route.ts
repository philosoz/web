import { NextRequest, NextResponse } from "next/server";
import path from "path";
import {
  ensureDir,
  readMetadata,
  addResume,
  validateFile,
  UPLOAD_DIR,
} from "@/lib/resume-api";

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

    // 验证文件 (异步)
    const validation = await validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const uuid = crypto.randomUUID();
    const fileExt = path.extname(file.name).toLowerCase();
    const fileName = `${timestamp}-${uuid}${fileExt}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // 保存文件
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const fs = await import("fs/promises");
    await fs.writeFile(filePath, buffer);

    // 添加到元数据
    const resume = await addResume(file.name, `/resume/${fileName}`);

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