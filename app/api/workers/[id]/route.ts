import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireOwnWorkerOrStaff } from "@/lib/auth";

// GET /api/workers/[id] - PROTECTED: Fetch full health history by id OR portableHealthId.
// Only staff (PROVIDER/ADMIN) or the worker themselves (matching session) may view it.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const identifier = id?.trim();

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Missing worker identifier in route parameter." },
        { status: 400 }
      );
    }

    const authError = await requireOwnWorkerOrStaff({
      id: identifier,
      portableHealthId: identifier,
    });
    if (authError) return authError;

    // Try finding by internal database ID or portableHealthId
    const worker = await prisma.worker.findFirst({
      where: {
        OR: [{ id: identifier }, { portableHealthId: identifier }],
      },
      include: {
        visits: {
          include: {
            facility: true,
            treatments: true,
          },
          orderBy: { date: "desc" },
        },
        screenings: {
          include: {
            facility: true,
          },
          orderBy: { date: "desc" },
        },
        treatments: {
          include: {
            visit: {
              include: { facility: true },
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!worker) {
      return NextResponse.json(
        {
          success: false,
          error: `Worker with ID or Portable Health ID '${identifier}' was not found.`,
        },
        { status: 404 }
    }

    // Aggregate summary statistics for clinical overview
    const historySummary = {
      totalVisits: worker.visits.length,
      totalScreenings: worker.screenings.length,
      totalTreatments: worker.treatments.length,
      facilitiesVisited: Array.from(
        new Set([
          ...worker.visits.map((v) => v.facility.name),
          ...worker.screenings.map((s) => s.facility.name),
        ])
      ),
      latestVisit: worker.visits[0] || null,
      latestScreening: worker.screenings[0] || null,
    };

    return NextResponse.json({
      success: true,
      data: {
        worker,
        summary: historySummary,
      },
    });
  } catch (error) {
    console.error("GET /api/workers/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while retrieving worker health history.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT /api/workers/[id] - PROTECTED: Requires PROVIDER or ADMIN role
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth(["PROVIDER", "ADMIN"]);
    if (authError) return authError;

    const { id } = await params;
    const identifier = id?.trim();

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload in request body." },
        { status: 400 }
      );
    }

    // Find existing worker
    const existing = await prisma.worker.findFirst({
      where: {
        OR: [{ id: identifier }, { portableHealthId: identifier }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Worker '${identifier}' not found.` },
        { status: 404 }
      );
    }

    const { name, dob, gender, phone, homeState, district, currentAddress, riskStatus } = body;

    const validRisks = ["GREEN", "YELLOW", "RED"];
    const updated = await prisma.worker.update({
      where: { id: existing.id },
      data: {
        name: name ? String(name).trim() : existing.name,
        dob: dob ? new Date(dob) : existing.dob,
        gender: gender ? String(gender).trim() : existing.gender,
        phone: phone !== undefined ? (phone ? String(phone).trim() : null) : existing.phone,
        homeState: homeState ? String(homeState).trim() : existing.homeState,
        district: district ? String(district).trim() : existing.district,
        currentAddress: currentAddress !== undefined ? (currentAddress ? String(currentAddress).trim() : null) : existing.currentAddress,
        riskStatus: riskStatus && validRisks.includes(riskStatus.toUpperCase()) ? riskStatus.toUpperCase() : existing.riskStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Worker record updated.",
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/workers/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while updating worker record.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
