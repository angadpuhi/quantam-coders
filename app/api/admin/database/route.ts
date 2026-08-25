import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/database - Strictly PROTECTED: Admin-only raw table viewer
export async function GET(request: Request) {
  try {
    // 1. Strict Server-Side Role Guard (ADMIN only)
    const authError = await requireAuth(["ADMIN"]);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const table = searchParams.get("table")?.toLowerCase().trim() || "workers";
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "15", 10), 1), 100);
    const search = searchParams.get("search")?.trim() || "";
    const skip = (page - 1) * limit;

    let rows: any[] = [];
    let totalCount = 0;
    let columns: string[] = [];

    switch (table) {
      case "workers": {
        const whereClause = search
          ? {
              OR: [
                { name: { contains: search } },
                { portableHealthId: { contains: search } },
                { homeState: { contains: search } },
                { district: { contains: search } },
                { riskStatus: { contains: search } },
              ],
            }
          : undefined;

        [totalCount, rows] = await Promise.all([
          prisma.worker.count({ where: whereClause }),
          prisma.worker.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
          }),
        ]);
        columns = [
          "id",
          "name",
          "portableHealthId",
          "riskStatus",
          "district",
          "homeState",
          "gender",
          "phone",
          "dob",
          "currentAddress",
          "createdAt",
          "updatedAt",
        ];
        break;
      }

      case "facilities": {
        const whereClause = search
          ? {
              OR: [
                { name: { contains: search } },
                { location: { contains: search } },
                { type: { contains: search } },
              ],
            }
          : undefined;

        [totalCount, rows] = await Promise.all([
          prisma.facility.count({ where: whereClause }),
          prisma.facility.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
          }),
        ]);
        columns = ["id", "name", "location", "type", "createdAt", "updatedAt"];
        break;
      }

      case "visits": {
        const whereClause = search
          ? {
              OR: [
                { id: { contains: search } },
                { notes: { contains: search } },
                { workerId: { contains: search } },
                { facilityId: { contains: search } },
              ],
            }
          : undefined;

        [totalCount, rows] = await Promise.all([
          prisma.visit.count({ where: whereClause }),
          prisma.visit.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { date: "desc" },
            include: {
              worker: { select: { name: true, portableHealthId: true } },
              facility: { select: { name: true } },
            },
          }),
        ]);
        columns = ["id", "workerId", "facilityId", "date", "notes", "createdAt"];
        break;
      }

      case "screenings": {
        const whereClause = search
          ? {
              OR: [
                { type: { contains: search } },
                { result: { contains: search } },
                { workerId: { contains: search } },
                { facilityId: { contains: search } },
              ],
            }
          : undefined;

        [totalCount, rows] = await Promise.all([
          prisma.screening.count({ where: whereClause }),
          prisma.screening.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { date: "desc" },
            include: {
              worker: { select: { name: true, portableHealthId: true } },
              facility: { select: { name: true } },
            },
          }),
        ]);
        columns = ["id", "workerId", "facilityId", "type", "result", "date", "createdAt"];
        break;
      }

      case "treatments": {
        const whereClause = search
          ? {
              OR: [
                { description: { contains: search } },
                { medication: { contains: search } },
                { workerId: { contains: search } },
                { visitId: { contains: search } },
              ],
            }
          : undefined;

        [totalCount, rows] = await Promise.all([
          prisma.treatment.count({ where: whereClause }),
          prisma.treatment.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { date: "desc" },
            include: {
              worker: { select: { name: true, portableHealthId: true } },
            },
          }),
        ]);
        columns = ["id", "workerId", "visitId", "description", "medication", "date", "createdAt"];
        break;
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Invalid table '${table}'. Allowed: workers, facilities, visits, screenings, treatments.`,
          },
          { status: 400 }
        );
    }

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json({
      success: true,
      meta: {
        table,
        page,
        limit,
        totalCount,
        totalPages,
        columns,
      },
      data: rows,
    });
  } catch (error) {
    console.error("GET /api/admin/database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error while querying database table.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
