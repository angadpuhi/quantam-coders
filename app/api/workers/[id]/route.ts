import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/workers/[id] - PUBLIC: Fetch full health history by id OR portableHealthId (NO LOGIN REQUIRED)
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
      );
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

// PUT /api/workers/[id] - PROTECTED: Requires STAFF or ADMIN role
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAuth(["STAFF", "ADMIN"]);
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

    const { name, dob, gender, phone, homeState, currentAddress } = body;

    let parsedDob: Date | null | undefined = undefined;
    if (dob !== undefined) {
      if (dob === null) {
        parsedDob = null;
      } else {
        const d = new Date(dob);
        if (isNaN(d.getTime())) {
          return NextResponse.json(
            { success: false, error: "Invalid date format for 'dob'." },
            { status: 400 }
          );
        }
        parsedDob = d;
      }
    }

    const updated = await prisma.worker.update({
      where: { id: existing.id },
      data: {
        name: name !== undefined ? String(name).trim() : undefined,
        dob: parsedDob,
        gender: gender !== undefined ? String(gender).trim() : undefined,
        phone: phone !== undefined ? (phone ? String(phone).trim() : null) : undefined,
        homeState: homeState !== undefined ? String(homeState).trim() : undefined,
        currentAddress:
          currentAddress !== undefined
            ? currentAddress
              ? String(currentAddress).trim()
              : null
            : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Worker record updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/workers/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while updating worker.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
