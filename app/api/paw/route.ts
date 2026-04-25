import { NextResponse } from "next/server";
import { getPawCount, incrementPawCount } from "@/lib/paw-storage";

export async function GET() {
  try {
    const count = await getPawCount();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get count" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const count = await incrementPawCount();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: "Failed to increment" }, { status: 500 });
  }
}
