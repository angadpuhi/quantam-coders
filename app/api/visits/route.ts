import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession, requireAuth } from "@/lib/auth";

// GET /api/visits - List visits (ROLE-SCOPED)
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

    // If WORKER: Enforce querying only their own visits
    const effectiveWorkerId = role === "WORKER" ? sessionWorkerId : workerId || undefined;

    const visits = await prisma.visit.findMany({
      where: {
        workerId: effectiveWorkerId,
        facilityId: facilityId || undefined,
        worker: (role !== "WORKER" && portableHealthId)
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

    const { workerId, facilityId, date, notes } = body;

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

    const newVisit = await prisma.visit.create({
      data: {
        workerId: worker.id,
        facilityId: facility.id,
        date: parsedDate,
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
        error: "Internal Server Error while creating clinical visit.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
