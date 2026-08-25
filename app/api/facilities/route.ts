import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/facilities - List all registered healthcare facilities (PUBLIC)
export async function GET() {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        _count: {
          select: { visits: true, screenings: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    console.error("GET /api/facilities error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while retrieving facilities.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST /api/facilities - Register a new healthcare facility (PROTECTED: ADMIN ONLY)
export async function POST(request: Request) {
  try {
    const authError = await requireAuth(["ADMIN"]);
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

    const { name, location, type } = body;

    const missing: string[] = [];
    if (!name || typeof name !== "string" || !name.trim()) missing.push("name");
    if (!location || typeof location !== "string" || !location.trim()) missing.push("location");
    if (!type || typeof type !== "string" || !type.trim()) missing.push("type");

    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const newFacility = await prisma.facility.create({
      data: {
        name: name.trim(),
        location: location.trim(),
        type: type.trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Healthcare facility registered successfully.",
        data: newFacility,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/facilities error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while creating facility.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
