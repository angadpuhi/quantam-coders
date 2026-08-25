import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/screenings - List screenings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId")?.trim();
    const portableHealthId = searchParams.get("portableHealthId")?.trim();
    const facilityId = searchParams.get("facilityId")?.trim();
    const type = searchParams.get("type")?.trim();

    const screenings = await prisma.screening.findMany({
      where: {
        workerId: workerId || undefined,
        facilityId: facilityId || undefined,
        type: type ? { contains: type } : undefined,
        worker: portableHealthId
          ? {
              portableHealthId,
            }
          : undefined,
      },
      include: {
        worker: true,
        facility: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: screenings.length,
      data: screenings,
    });
  } catch (error) {
    console.error("GET /api/screenings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while retrieving screening records.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST /api/screenings - PROTECTED: Requires STAFF or ADMIN role
export async function POST(request: Request) {
  try {
    const authError = await requireAuth(["STAFF", "ADMIN"]);
    if (authError) return authError;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload in request body." },
        { status: 400 }
      );
    }

    const { workerId, portableHealthId, facilityId, type, result, date } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!facilityId || typeof facilityId !== "string" || !facilityId.trim())
      missingFields.push("facilityId");
    if (!type || typeof type !== "string" || !type.trim()) missingFields.push("type");
    if (!result || typeof result !== "string" || !result.trim()) missingFields.push("result");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing or invalid required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Verify worker exists
    if (!workerId && !portableHealthId) {
      return NextResponse.json(
        {
          success: false,
          error: "Either 'workerId' or 'portableHealthId' must be provided.",
        },
        { status: 400 }
      );
    }

    const worker = await prisma.worker.findFirst({
      where: {
        OR: [
          workerId ? { id: String(workerId).trim() } : {},
          portableHealthId ? { portableHealthId: String(portableHealthId).trim() } : {},
        ],
      },
    });

    if (!worker) {
      return NextResponse.json(
        {
          success: false,
          error: `Worker '${workerId || portableHealthId}' was not found.`,
        },
        { status: 404 }
      );
    }

    // Verify facility exists
    const facility = await prisma.facility.findUnique({
      where: { id: String(facilityId).trim() },
    });

    if (!facility) {
      return NextResponse.json(
        {
          success: false,
          error: `Facility with ID '${facilityId}' was not found.`,
        },
        { status: 404 }
      );
    }

    // Parse date if provided
    let screeningDate = new Date();
    if (date) {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid date format for 'date'. Please use ISO-8601 (YYYY-MM-DD).",
          },
          { status: 400 }
        );
      }
      screeningDate = d;
    }

    const newScreening = await prisma.screening.create({
      data: {
        workerId: worker.id,
        facilityId: facility.id,
        type: String(type).trim(),
        result: String(result).trim(),
        date: screeningDate,
      },
      include: {
        worker: true,
        facility: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Screening record logged successfully.",
        data: newScreening,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/screenings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while logging screening record.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
