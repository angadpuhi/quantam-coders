import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [workerCount, facilityCount, visitCount, screeningCount, treatmentCount] =
      await Promise.all([
        prisma.worker.count(),
        prisma.facility.count(),
        prisma.visit.count(),
        prisma.screening.count(),
        prisma.treatment.count(),
      ]);

    return NextResponse.json({
      status: "ok",
      service: "MigrantHealth Kerala Portal",
      database: "connected (SQLite)",
      stats: {
        workers: workerCount,
        facilities: facilityCount,
        visits: visitCount,
        screenings: screeningCount,
        treatments: treatmentCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        service: "MigrantHealth Kerala Portal",
        database: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
