const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Kerala MigrantHealth database with new models...");

  // 1. Create Facilities
  const perumbavoorCHC = await prisma.facility.upsert({
    where: { id: "fac-perumbavoor-chc" },
    update: {},
    create: {
      id: "fac-perumbavoor-chc",
      name: "Perumbavoor Community Health Centre",
      location: "Ernakulam District, Kerala",
      type: "CHC",
    },
  });

  const kozhikodeGH = await prisma.facility.upsert({
    where: { id: "fac-kozhikode-gh" },
    update: {},
    create: {
      id: "fac-kozhikode-gh",
      name: "Kozhikode Beach General Hospital",
      location: "Kozhikode District, Kerala",
      type: "General Hospital",
    },
  });

  const palakkadPHC = await prisma.facility.upsert({
    where: { id: "fac-kanjikode-phc" },
    update: {},
    create: {
      id: "fac-kanjikode-phc",
      name: "Kanjikode Primary Health Centre",
      location: "Palakkad District, Kerala",
      type: "PHC",
    },
  });

  const mobileUnit = await prisma.facility.upsert({
    where: { id: "fac-mobile-unit-1" },
    update: {},
    create: {
      id: "fac-mobile-unit-1",
      name: "Mobile Medical Unit - Ernakulam Industrial Belt",
      location: "Perumbavoor / Aluva, Kerala",
      type: "Mobile Camp",
    },
  });

  // 2. Create Workers
  const worker1 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-829104" },
    update: {},
    create: {
      id: "worker-1",
      name: "Debabrata Das",
      dob: new Date("1993-04-12"),
      gender: "Male",
      phone: "+91 98312 44910",
      homeState: "West Bengal",
      currentAddress: "Plywood Colony, Perumbavoor, Ernakulam, Kerala",
      portableHealthId: "KL-MH-829104",
    },
  });

  const worker2 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-654219" },
    update: {},
    create: {
      id: "worker-2",
      name: "Raju Boro",
      dob: new Date("1998-09-24"),
      gender: "Male",
      phone: "+91 88765 12093",
      homeState: "Assam",
      currentAddress: "Camp Shed 4, Beach Road, Kozhikode, Kerala",
      portableHealthId: "KL-MH-654219",
    },
  });

  const worker3 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-338102" },
    update: {},
    create: {
      id: "worker-3",
      name: "Santosh Mohapatra",
      dob: new Date("1989-11-05"),
      gender: "Male",
      phone: "+91 94371 88201",
      homeState: "Odisha",
      currentAddress: "Kanjikode Industrial Area, Palakkad, Kerala",
      portableHealthId: "KL-MH-338102",
    },
  });

  // 3. Create Visits
  const visit1 = await prisma.visit.create({
    data: {
      id: "visit-1",
      workerId: worker1.id,
      facilityId: perumbavoorCHC.id,
      date: new Date("2026-06-15"),
      notes: "Routine occupational respiratory health checkup. Worker reports mild chest tightness after timber processing shift.",
    },
  });

  const visit2 = await prisma.visit.create({
    data: {
      id: "visit-2",
      workerId: worker2.id,
      facilityId: kozhikodeGH.id,
      date: new Date("2026-07-02"),
      notes: "Annual construction worker fitness screening. Vitals normal.",
    },
  });

  const visit3 = await prisma.visit.create({
    data: {
      id: "visit-3",
      workerId: worker3.id,
      facilityId: palakkadPHC.id,
      date: new Date("2026-08-01"),
      notes: "Presented with dizziness after high-heat foundry shift.",
    },
  });

  // 4. Create Screenings
  await prisma.screening.createMany({
    data: [
      {
        workerId: worker1.id,
        facilityId: mobileUnit.id,
        type: "Tuberculosis Screening (Mantoux & Sputum)",
        result: "Negative",
        date: new Date("2026-05-10"),
      },
      {
        workerId: worker1.id,
        facilityId: perumbavoorCHC.id,
        type: "Occupational Spirometry",
        result: "Normal lung volumes",
        date: new Date("2026-06-15"),
      },
      {
        workerId: worker2.id,
        facilityId: kozhikodeGH.id,
        type: "Malaria Rapid Diagnostic Test",
        result: "Negative",
        date: new Date("2026-07-02"),
      },
      {
        workerId: worker2.id,
        facilityId: kozhikodeGH.id,
        type: "Blood Pressure & Hypertension",
        result: "Normal (118/78 mmHg)",
        date: new Date("2026-07-02"),
      },
      {
        workerId: worker3.id,
        facilityId: palakkadPHC.id,
        type: "Random Blood Sugar (Diabetes)",
        result: "104 mg/dL (Normal)",
        date: new Date("2026-08-01"),
      },
    ],
  });

  // 5. Create Treatments
  await prisma.treatment.createMany({
    data: [
      {
        workerId: worker1.id,
        visitId: visit1.id,
        description: "Dust exposure symptomatic relief and protective gear guidance",
        medication: "Cetirizine 10mg OD x 5 days, N95 respirators provided",
        date: new Date("2026-06-15"),
      },
      {
        workerId: worker2.id,
        visitId: visit2.id,
        description: "Prophylactic multivitamin and iron supplementation",
        medication: "Daily Multivitamin tablet x 30 days",
        date: new Date("2026-07-02"),
      },
      {
        workerId: worker3.id,
        visitId: visit3.id,
        description: "Oral rehydration and thermal rest protocol for heat exhaustion",
        medication: "Oral Rehydration Salts (ORS) packets x 3 days, Paracetamol 500mg SOS",
        date: new Date("2026-08-01"),
      },
    ],
  });

  console.log("Database seeded successfully with Facilities, Workers, Visits, Screenings, and Treatments!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
