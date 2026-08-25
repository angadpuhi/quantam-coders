const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function inspectDb() {
  try {
    console.log("Checking workers...");
    const workers = await prisma.worker.findMany();
    console.log(`Found ${workers.length} workers.`);

    console.log("Checking health checks...");
    const checks = await prisma.healthCheck.findMany();
    console.log(`Found ${checks.length} health checks.`);
    for (const c of checks) {
      console.log(`HealthCheck id: ${c.id}, answers length: ${c.answers?.length}`);
      try {
        JSON.parse(c.answers);
      } catch (err) {
        console.error(`❌ Corrupted answers in HealthCheck ${c.id}:`, err.message);
      }
    }

    console.log("Checking facilities...");
    const facs = await prisma.facility.findMany();
    console.log(`Found ${facs.length} facilities.`);

    console.log("Checking visits...");
    const visits = await prisma.visit.findMany();
    console.log(`Found ${visits.length} visits.`);

    console.log("Checking screenings...");
    const screenings = await prisma.screening.findMany();
    console.log(`Found ${screenings.length} screenings.`);

    console.log("Checking treatments...");
    const treatments = await prisma.treatment.findMany();
    console.log(`Found ${treatments.length} treatments.`);
  } catch (err) {
    console.error("Database check failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

inspectDb();
