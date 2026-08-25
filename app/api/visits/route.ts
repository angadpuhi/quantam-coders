import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/visits - List visits
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId")?.trim();
    const portableHealthId = searchParams.get("portableHealthId")?.trim();
    const facilityId = searchParams.get("facilityId")?.trim();

    const visits = await prisma.visit.findMany({
      where: {
        workerId: workerId || undefined,
        facilityId: facilityId || undefined,
        worker: portableHealthId
          ? {
              portableHealthId,
            }
          : undefined,
      },
      include: {
        worker: true,
        facility: true,
        treatments: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: visits.length,
      data: visits,
    });
  } catch (error) {
    console.error("GET /api/visits error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while retrieving visits.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST /api/visits - PROTECTED: Requires PROVIDER or ADMIN role
export async function POST(request: Request) {
  try {
    const authError = await requireAuth(["PROVIDER", "ADMIN"]);
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

    const { workerId, portableHealthId, facilityId, date, notes } = body;

    // Validate facilityId
    if (!facilityId || typeof facilityId !== "string" || !facilityId.trim()) {
      return NextResponse.json(
        { success: false, error: "Field 'facilityId' is required." },
        { status: 400 }
      );
    }

    // Identify worker either by workerId or portableHealthId
    if (!workerId && !portableHealthId) {
      return NextResponse.json(
        {
          success: false,
          error: "Either 'workerId' or 'portableHealthId' must be provided to associate the visit.",
        },
        { status: 400 }
      );
    }

    // Verify worker exists
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
          error: `Worker '${workerId || portableHealthId}' does not exist in registry.`,
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
          error: `Healthcare Facility with ID '${facilityId}' was not found.`,
        },
        { status: 404 }
      );
    }

    // Parse date if provided
    let visitDate = new Date();
    if (date) {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid date format for 'date'. Please use ISO-8601 (YYYY-MM-DD or full timestamp).",
          },
          { status: 400 }
        );
      }
      visitDate = d;
    }

    const newVisit = await prisma.visit.create({
      data: {
        workerId: worker.id,
        facilityId: facility.id,
        date: visitDate,
        notes: notes ? String(notes).trim() : null,
      },
      include: {
        worker: true,
        facility: true,
        treatments: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Clinical visit recorded successfully.",
        data: newVisit,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/visits error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while creating visit record.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
