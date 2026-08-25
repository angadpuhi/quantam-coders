import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workerCount = await prisma.worker.count();
    return NextResponse.json({
      status: "ok",
      service: "MigrantHealth Kerala Portal",
      database: "connected (SQLite)",
      stats: {
        workerCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        service: "MigrantHealth Kerala Portal",
        database: "uninitialized or error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
