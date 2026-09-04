import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession, requireAuth } from "@/lib/auth";

// GET /api/screenings - List screenings (ROLE-SCOPED)
export async function GET(request: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const role = (session.user as any).role;
    const sessionWorkerId = (session.user as any).workerId;

    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId")?.trim();
    const portableHealthId = searchParams.get("portableHealthId")?.trim();
    const facilityId = searchParams.get("facilityId")?.trim();
    const type = searchParams.get("type")?.trim();

    // If WORKER: Enforce querying only their own screenings
    const effectiveWorkerId = role === "WORKER" ? sessionWorkerId : workerId || undefined;

    const screenings = await prisma.screening.findMany({
      where: {
        workerId: effectiveWorkerId,
        facilityId: facilityId || undefined,
        type: type ? { contains: type } : undefined,
        worker: (role !== "WORKER" && portableHealthId)
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

// POST /api/screenings - PROTECTED: Requires PROVIDER or ADMIN role
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

    const { workerId, facilityId, type, result, date } = body;

    if (!workerId || typeof workerId !== "string" || !workerId.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing required field 'workerId'." },
        { status: 400 }
      );
    }

    if (!facilityId || typeof facilityId !== "string" || !facilityId.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing required field 'facilityId'." },
        { status: 400 }
      );
    }

    if (!type || typeof type !== "string" || !type.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing required field 'type'." },
        { status: 400 }
      );
    }

    if (!result || typeof result !== "string" || !result.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing required field 'result'." },
        { status: 400 }
      );
    }

    const worker = await prisma.worker.findFirst({
      where: {
        OR: [{ id: workerId.trim() }, { portableHealthId: workerId.trim() }],
      },
    });

    if (!worker) {
      return NextResponse.json(
        { success: false, error: `Worker '${workerId}' was not found.` },
        { status: 404 }
      );
    }

    const facility = await prisma.facility.findUnique({
      where: { id: facilityId.trim() },
    });

    if (!facility) {
      return NextResponse.json(
        { success: false, error: `Facility with ID '${facilityId}' was not found.` },
        { status: 404 }
      );
    }

    let parsedDate = new Date();
    if (date) {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          { success: false, error: "Invalid date format for 'date'. Please use ISO-8601." },
          { status: 400 }
        );
      }
      parsedDate = d;
    }

    const newScreening = await prisma.screening.create({
      data: {
        workerId: worker.id,
        facilityId: facility.id,
        type: type.trim(),
        result: result.trim(),
        date: parsedDate,
      },
      include: {
        worker: true,
        facility: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Screening record created successfully.",
        data: newScreening,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/screenings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while creating screening record.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
