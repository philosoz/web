import { NextResponse } from "next/server";
import { getPawCount, incrementPawCount } from "@/lib/paw-storage";

const TIMEOUT_MS = 5000;
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 3000];

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function logError(context: string, error: unknown, timestamp: string) {
  const errorType = error instanceof Error ? error.name : "Unknown";
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[${timestamp}] [${errorType}] ${context}: ${errorMessage}`);
}

async function withTimeout<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    operation(),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs);
    }),
  ]);
}

async function withRetry<T>(operation: () => Promise<T>, retries: number, delays: number[]): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
      }
    }
  }

  throw lastError;
}

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const count = await withRetry(
      () => withTimeout(() => getPawCount(), TIMEOUT_MS),
      MAX_RETRIES,
      RETRY_DELAYS
    );

    return NextResponse.json(
      { count },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    logError("GET /api/paw", error, timestamp);
    return NextResponse.json(
      { error: "Failed to get count" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export async function POST() {
  const timestamp = new Date().toISOString();

  try {
    const count = await withRetry(
      () => withTimeout(() => incrementPawCount(), TIMEOUT_MS),
      MAX_RETRIES,
      RETRY_DELAYS
    );

    return NextResponse.json(
      { count },
      { headers: getCorsHeaders() }
    );
  } catch (error) {
    logError("POST /api/paw", error, timestamp);
    return NextResponse.json(
      { error: "Failed to increment" },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...getCorsHeaders(),
      "Access-Control-Max-Age": "86400",
    },
  });
}