import { NextResponse } from "next/server";
import { getResumeList } from "@/lib/resume-api";

export async function GET() {
  try {
    const resumes = await getResumeList();
    return NextResponse.json({ resumes });
  } catch {
    return NextResponse.json(
      { error: "获取简历列表失败" },
      { status: 500 }
    );
  }
}