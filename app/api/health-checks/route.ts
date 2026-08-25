import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/health-checks - Create a 2-minute health check & auto-update worker riskStatus
export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const { workerId, answers, notes } = body;

    if (!workerId) {
      return NextResponse.json(
        { success: false, error: "Missing required 'workerId' or 'portableHealthId'." },
        { status: 400 }
      );
    }

    // Find worker by ID or portableHealthId
    const worker = await prisma.worker.findFirst({
      where: {
        OR: [{ id: workerId }, { portableHealthId: workerId }],
      },
    });

    if (!worker) {
      return NextResponse.json(
        { success: false, error: `Worker '${workerId}' not found.` },
        { status: 404 }
      );
    }

    // Calculate severity score and risk category from answers
    let totalScore = 0;
    let hasRedFlag = false;
    let hasYellowFlag = false;
    const answersObj = typeof answers === "object" && answers !== null ? answers : {};

    for (const key of Object.keys(answersObj)) {
      const item = answersObj[key];
      const pts = typeof item === "number" ? item : Number(item?.score || item?.value || 0);
      totalScore += pts;

      if (pts >= 4 || item?.severity === "RED") {
        hasRedFlag = true;
      } else if (pts >= 2 || item?.severity === "YELLOW") {
        hasYellowFlag = true;
      }
    }

    // Determine Triage Risk Level
    let calculatedRisk: "GREEN" | "YELLOW" | "RED" = "GREEN";
    if (hasRedFlag || totalScore >= 7) {
      calculatedRisk = "RED";
    } else if (hasYellowFlag || totalScore >= 3) {
      calculatedRisk = "YELLOW";
    } else {
      calculatedRisk = "GREEN";
    }

    const flaggedForDoctor = calculatedRisk === "YELLOW" || calculatedRisk === "RED";

    // Create HealthCheck record
    const healthCheck = await prisma.healthCheck.create({
      data: {
        workerId: worker.id,
        score: totalScore,
        riskStatus: calculatedRisk,
        flaggedForDoctor,
        answers: JSON.stringify(answersObj),
        notes: notes ? String(notes).trim() : null,
      },
    });

    // Automatically update the Worker's riskStatus
    const updatedWorker = await prisma.worker.update({
      where: { id: worker.id },
      data: { riskStatus: calculatedRisk },
    });

    // Also link a Screening record so it shows in the worker's clinical screening history
    const defaultFacility = await prisma.facility.findFirst();
    if (defaultFacility) {
      await prisma.screening.create({
        data: {
          workerId: worker.id,
          facilityId: defaultFacility.id,
          type: "2-Minute Health Triage Screening",
          result: `Triage: ${calculatedRisk} (Score: ${totalScore} pts)${
            flaggedForDoctor ? " • Doctor Visit Flagged" : " • Stable"
          }`,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Health check logged successfully. Worker risk updated to ${calculatedRisk}.`,
        data: {
          healthCheck,
          worker: updatedWorker,
          riskStatus: calculatedRisk,
          flaggedForDoctor,
          totalScore,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/health-checks error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while saving health check.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET /api/health-checks - Retrieve health checks for a worker
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId")?.trim();

    const whereClause = workerId
      ? {
          worker: {
            OR: [{ id: workerId }, { portableHealthId: workerId }],
          },
        }
      : {};

    const healthChecks = await prisma.healthCheck.findMany({
      where: whereClause,
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            portableHealthId: true,
            riskStatus: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: healthChecks.length,
      data: healthChecks,
    });
  } catch (error) {
    console.error("GET /api/health-checks error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while retrieving health checks.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
