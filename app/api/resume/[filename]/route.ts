import { NextRequest, NextResponse } from "next/server";
import { deleteResume } from "@/lib/resume-api";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "缺少文件名参数" },
        { status: 400 }
      );
    }

    const resumes = await deleteResume(filename);
    return NextResponse.json({ resumes });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "删除简历失败" },
      { status: 500 }
    );
  }
}