import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateHealthId } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";

// GET /api/workers - PUBLIC: Search by portableHealthId, query 'q', or list all (NO LOGIN REQUIRED)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const portableHealthId = searchParams.get("portableHealthId")?.trim();
    const query = searchParams.get("q")?.trim();

    // 1. Search by exact portableHealthId if specified
    if (portableHealthId) {
      const worker = await prisma.worker.findUnique({
        where: { portableHealthId },
        include: {
          visits: {
            include: { facility: true, treatments: true },
            orderBy: { date: "desc" },
          },
          screenings: {
            include: { facility: true },
            orderBy: { date: "desc" },
          },
          treatments: {
            include: { visit: { include: { facility: true } } },
            orderBy: { date: "desc" },
          },
        },
      });

      if (!worker) {
        return NextResponse.json(
          {
            success: false,
            error: `Worker with portableHealthId '${portableHealthId}' not found.`,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: worker,
      });
    }

    // 2. Search by keyword or list all
    const workers = await prisma.worker.findMany({
      where: query
        ? {
            OR: [
              { portableHealthId: { contains: query } },
              { name: { contains: query } },
              { phone: { contains: query } },
              { homeState: { contains: query } },
              { currentAddress: { contains: query } },
            ],
          }
        : undefined,
      include: {
        visits: {
          include: { facility: true, treatments: true },
          orderBy: { date: "desc" },
        },
        screenings: {
          include: { facility: true },
          orderBy: { date: "desc" },
        },
        treatments: {
          orderBy: { date: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: workers.length,
      data: workers,
    });
  } catch (error) {
    console.error("GET /api/workers error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while retrieving workers.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST /api/workers - PROTECTED: Requires STAFF or ADMIN role
export async function POST(request: Request) {
  try {
    // Role check: Only STAFF or ADMIN can register workers
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

    const { name, dob, gender, phone, homeState, currentAddress, portableHealthId, riskStatus } = body;

    // Field validation
    const missingFields: string[] = [];
    if (!name || typeof name !== "string" || !name.trim()) missingFields.push("name");
    if (!gender || typeof gender !== "string" || !gender.trim()) missingFields.push("gender");
    if (!homeState || typeof homeState !== "string" || !homeState.trim()) missingFields.push("homeState");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing or invalid required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Determine portableHealthId (custom or auto-generated)
    const finalHealthId = (portableHealthId && typeof portableHealthId === "string" && portableHealthId.trim())
      ? portableHealthId.trim().toUpperCase()
      : generateHealthId();

    // Check for duplicate portableHealthId
    const existing = await prisma.worker.findUnique({
      where: { portableHealthId: finalHealthId },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `A worker with portableHealthId '${finalHealthId}' already exists.`,
        },
        { status: 409 }
      );
    }

    // Parse DOB if provided
    let parsedDob: Date | null = null;
    if (dob) {
      const d = new Date(dob);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid date format for 'dob'. Please use ISO-8601 (YYYY-MM-DD).",
          },
          { status: 400 }
        );
      }
      parsedDob = d;
    }

    // Validate riskStatus
    const validRisks = ["GREEN", "YELLOW", "RED"];
    const finalRisk = riskStatus && typeof riskStatus === "string" && validRisks.includes(riskStatus.toUpperCase())
      ? riskStatus.toUpperCase()
      : "GREEN";

    const newWorker = await prisma.worker.create({
      data: {
        name: name.trim(),
        dob: parsedDob,
        gender: gender.trim(),
        phone: phone ? String(phone).trim() : null,
        homeState: homeState.trim(),
        currentAddress: currentAddress ? String(currentAddress).trim() : null,
        portableHealthId: finalHealthId,
        riskStatus: finalRisk,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Worker successfully registered.",
        data: newWorker,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/workers error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while creating worker.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
