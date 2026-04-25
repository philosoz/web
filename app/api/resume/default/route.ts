import { NextRequest, NextResponse } from "next/server";
import { setDefaultResume } from "@/lib/resume-api";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "缺少简历 ID" },
        { status: 400 }
      );
    }

    const resumes = await setDefaultResume(id);
    return NextResponse.json({ resumes });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "设置默认简历失败" },
      { status: 500 }
    );
  }
}