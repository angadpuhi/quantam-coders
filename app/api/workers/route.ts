import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateHealthId } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    const workers = await prisma.worker.findMany({
      where: query
        ? {
            OR: [
              { fullName: { contains: query } },
              { healthId: { contains: query } },
              { phone: { contains: query } },
              { awaazId: { contains: query } },
              { keralaDistrict: { contains: query } },
            ],
          }
        : undefined,
      include: {
        healthRecords: {
          orderBy: { visitDate: "desc" },
        },
        vaccinations: {
          orderBy: { administeredDate: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, count: workers.length, data: workers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch workers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      gender,
      bloodGroup,
      phone,
      stateOfOrigin,
      nativeLanguage,
      keralaDistrict,
      localAddress,
      currentEmployer,
      occupation,
      awaazId,
      emergencyContactName,
      emergencyContactPhone,
      allergies,
      chronicConditions,
    } = body;

    if (!fullName || !stateOfOrigin || !nativeLanguage || !keralaDistrict) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields (fullName, stateOfOrigin, nativeLanguage, keralaDistrict)",
        },
        { status: 400 }
      );
    }

    const healthId = body.healthId || generateHealthId();

    const newWorker = await prisma.worker.create({
      data: {
        healthId,
        awaazId,
        fullName,
        gender: gender || "Not Specified",
        bloodGroup,
        phone,
        stateOfOrigin,
        nativeLanguage,
        keralaDistrict,
        localAddress,
        currentEmployer,
        occupation,
        emergencyContactName,
        emergencyContactPhone,
        allergies,
        chronicConditions,
      },
    });

    return NextResponse.json({ success: true, data: newWorker }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create worker" },
      { status: 500 }
    );
  }
}
