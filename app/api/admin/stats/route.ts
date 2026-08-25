import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Aggregate queries in parallel
    const [
      totalWorkers,
      totalFacilities,
      totalVisits,
      visitsThisMonth,
      totalScreenings,
      screeningsThisMonth,
      totalTreatments,
      workersByState,
      facilitiesWithCounts,
      allScreeningsThisMonth,
      allScreenings,
      recentScreenings,
    ] = await Promise.all([
      // 1. Total Workers
      prisma.worker.count(),
      // 2. Total Facilities
      prisma.facility.count(),
      // 3. Total Visits
      prisma.visit.count(),
      // 4. Visits this month
      prisma.visit.count({
        where: { date: { gte: startOfMonth } },
      }),
      // 5. Total Screenings
      prisma.screening.count(),
      // 6. Screenings this month
      prisma.screening.count({
        where: { date: { gte: startOfMonth } },
      }),
      // 7. Total Treatments
      prisma.treatment.count(),
      // 8. Workers grouped by home state
      prisma.worker.groupBy({
        by: ["homeState"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      // 9. Visits & Screenings per facility
      prisma.facility.findMany({
        include: {
          _count: {
            select: { visits: true, screenings: true },
          },
        },
        orderBy: { visits: { _count: "desc" } },
      }),
      // 10. Screenings this month grouped by type
      prisma.screening.groupBy({
        by: ["type"],
        where: { date: { gte: startOfMonth } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      // 11. All-time screenings grouped by type (for fallback / broad baseline)
      prisma.screening.groupBy({
        by: ["type"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      // 12. Recent Screenings with worker & facility details
      prisma.screening.findMany({
        take: 6,
        orderBy: { date: "desc" },
        include: {
          worker: { select: { name: true, portableHealthId: true, homeState: true } },
          facility: { select: { name: true, type: true, location: true } },
        },
      }),
    ]);

    // Format Facility Visits for simple Bar Chart
    const facilityVisitsChart = facilitiesWithCounts.map((fac) => ({
      id: fac.id,
      name: fac.name,
      shortName: fac.name.replace("Community Health Centre", "CHC").replace("General Hospital", "GH").replace("Primary Health Centre", "PHC"),
      location: fac.location,
      type: fac.type,
      visitCount: fac._count.visits,
      screeningCount: fac._count.screenings,
      totalActivity: fac._count.visits + fac._count.screenings,
    }));

    // Format Screenings by Type this month (with fallback to all-time if month just started)
    const activeScreeningStats = (allScreeningsThisMonth.length > 0 ? allScreeningsThisMonth : allScreenings).map(
      (sc) => ({
        type: sc.type,
        count: sc._count.id,
        percentage:
          totalScreenings > 0 ? Math.round((sc._count.id / (totalScreenings || 1)) * 100) : 0,
      })
    );

    // Format Worker State Distribution
    const stateDistribution = workersByState.map((st) => ({
      state: st.homeState,
      count: st._count.id,
      percentage: totalWorkers > 0 ? Math.round((st._count.id / totalWorkers) * 100) : 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalWorkers,
          totalFacilities,
          totalVisits,
          visitsThisMonth: visitsThisMonth > 0 ? visitsThisMonth : totalVisits,
          totalScreenings,
          screeningsThisMonth: screeningsThisMonth > 0 ? screeningsThisMonth : totalScreenings,
          totalTreatments,
        },
        facilityVisitsChart,
        screeningsByType: activeScreeningStats,
        stateDistribution,
        recentScreenings,
        surveillanceMonth: now.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate surveillance statistics.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
