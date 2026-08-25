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
              { name: { contains: query } },
              { portableHealthId: { contains: query } },
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
    const { name, dob, gender, phone, homeState, currentAddress, portableHealthId } = body;

    if (!name || !gender || !homeState) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields (name, gender, homeState)",
        },
        { status: 400 }
      );
    }

    const healthId = portableHealthId || generateHealthId();

    const newWorker = await prisma.worker.create({
      data: {
        name,
        dob: dob ? new Date(dob) : null,
        gender,
        phone,
        homeState,
        currentAddress,
        portableHealthId: healthId,
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
