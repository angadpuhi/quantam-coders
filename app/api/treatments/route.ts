import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/treatments - List treatments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId")?.trim();
    const portableHealthId = searchParams.get("portableHealthId")?.trim();
    const visitId = searchParams.get("visitId")?.trim();

    const treatments = await prisma.treatment.findMany({
      where: {
        workerId: workerId || undefined,
        visitId: visitId || undefined,
        worker: portableHealthId
          ? {
              portableHealthId,
            }
          : undefined,
      },
      include: {
        worker: true,
        visit: {
          include: { facility: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: treatments.length,
      data: treatments,
    });
  } catch (error) {
    console.error("GET /api/treatments error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while retrieving treatments.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST /api/treatments - PROTECTED: Requires PROVIDER or ADMIN role
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

    const { workerId, portableHealthId, visitId, description, medication, date } = body;

    // Validate required fields
    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { success: false, error: "Field 'description' is required." },
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

    // If visitId is provided, verify visit exists
    let validVisitId: string | null = null;
    if (visitId) {
      const visit = await prisma.visit.findUnique({
        where: { id: String(visitId).trim() },
      });

      if (!visit) {
        return NextResponse.json(
          {
            success: false,
            error: `Clinical Visit with ID '${visitId}' was not found.`,
          },
          { status: 404 }
        );
      }
      validVisitId = visit.id;
    }

    // Parse date if provided
    let treatmentDate = new Date();
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
      treatmentDate = d;
    }

    const newTreatment = await prisma.treatment.create({
      data: {
        workerId: worker.id,
        visitId: validVisitId,
        description: String(description).trim(),
        medication: medication ? String(medication).trim() : null,
        date: treatmentDate,
      },
      include: {
        worker: true,
        visit: {
          include: { facility: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Treatment plan recorded successfully.",
        data: newTreatment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/treatments error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while creating treatment record.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
