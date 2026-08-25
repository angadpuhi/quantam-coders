const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Kerala MigrantHealth database with Auth Users and rich Health Passport Records...");

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

  // 2. Create Staff & Admin Users
  const staffPassword = await bcrypt.hash("staff123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  const staffUser = await prisma.user.upsert({
    where: { email: "staff@keralahealth.gov.in" },
    update: { password: staffPassword },
    create: {
      name: "Dr. Ananya Nair (Medical Officer)",
      email: "staff@keralahealth.gov.in",
      password: staffPassword,
      role: "STAFF",
      facilityId: perumbavoorCHC.id,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@keralahealth.gov.in" },
    update: { password: adminPassword },
    create: {
      name: "Kerala Health Directorate Admin",
      email: "admin@keralahealth.gov.in",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // 3. Create Workers
  const worker1 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-829104" },
    update: {
      name: "Debabrata Das",
      dob: new Date("1993-04-12"),
      gender: "Male",
      phone: "+91 98312 44910",
      homeState: "West Bengal",
      currentAddress: "Plywood Colony, Rayonpuram, Perumbavoor, Ernakulam, Kerala",
    },
    create: {
      id: "worker-1",
      name: "Debabrata Das",
      dob: new Date("1993-04-12"),
      gender: "Male",
      phone: "+91 98312 44910",
      homeState: "West Bengal",
      currentAddress: "Plywood Colony, Rayonpuram, Perumbavoor, Ernakulam, Kerala",
      portableHealthId: "KL-MH-829104",
    },
  });

  const worker2 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-654219" },
    update: {
      name: "Raju Boro",
      dob: new Date("1998-09-24"),
      gender: "Male",
      phone: "+91 88765 12093",
      homeState: "Assam",
      currentAddress: "Camp Shed 4, Beach Road, Kozhikode, Kerala",
    },
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
    update: {
      name: "Santosh Mohapatra",
      dob: new Date("1989-11-05"),
      gender: "Male",
      phone: "+91 94371 88201",
      homeState: "Odisha",
      currentAddress: "Kanjikode Industrial Area, Palakkad, Kerala",
    },
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

  const worker4 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-491084" },
    update: {
      name: "Bikash Mondal",
      dob: new Date("1995-02-18"),
      gender: "Male",
      phone: "+91 97482 30194",
      homeState: "West Bengal",
      currentAddress: "Aluva Construction Camp, Ernakulam, Kerala",
    },
    create: {
      id: "worker-4",
      name: "Bikash Mondal",
      dob: new Date("1995-02-18"),
      gender: "Male",
      phone: "+91 97482 30194",
      homeState: "West Bengal",
      currentAddress: "Aluva Construction Camp, Ernakulam, Kerala",
      portableHealthId: "KL-MH-491084",
    },
  });

  // 4. Create Visits & Clean up
  await prisma.treatment.deleteMany({});
  await prisma.screening.deleteMany({});
  await prisma.visit.deleteMany({});

  const visit1 = await prisma.visit.create({
    data: {
      id: "visit-1",
      workerId: worker1.id,
      facilityId: perumbavoorCHC.id,
      date: new Date("2026-06-15"),
      notes: "Routine occupational respiratory health checkup. Worker reports mild chest tightness after timber processing shift. Auscultation clear, vitals normal.",
    },
  });

  const visit2 = await prisma.visit.create({
    data: {
      id: "visit-2",
      workerId: worker2.id,
      facilityId: kozhikodeGH.id,
      date: new Date("2026-07-02"),
      notes: "Annual construction worker fitness screening. Vitals normal. BP 118/78 mmHg. Hearing & vision tests clear.",
    },
  });

  const visit3 = await prisma.visit.create({
    data: {
      id: "visit-3",
      workerId: worker3.id,
      facilityId: palakkadPHC.id,
      date: new Date("2026-08-01"),
      notes: "Presented with dizziness and dehydration after high-heat foundry shift. Administered IV fluids and rest.",
    },
  });

  const visit4 = await prisma.visit.create({
    data: {
      id: "visit-4",
      workerId: worker4.id,
      facilityId: mobileUnit.id,
      date: new Date("2026-08-10"),
      notes: "Mobile medical unit field screening at Aluva metro worksite. General physical examination satisfactory.",
    },
  });

  // 5. Create Diagnostic Screenings & Vaccinations
  await prisma.screening.createMany({
    data: [
      // Worker 1
      {
        workerId: worker1.id,
        facilityId: mobileUnit.id,
        type: "Tuberculosis Screening (Mantoux & Sputum)",
        result: "Negative (Normal)",
        date: new Date("2026-05-10"),
      },
      {
        workerId: worker1.id,
        facilityId: perumbavoorCHC.id,
        type: "Occupational Spirometry",
        result: "Normal lung volumes (FEV1/FVC 84%)",
        date: new Date("2026-06-15"),
      },
      {
        workerId: worker1.id,
        facilityId: perumbavoorCHC.id,
        type: "Vaccination: Tetanus Toxoid (TT)",
        result: "Administered (Dose 1 / Batch #TT-9041)",
        date: new Date("2026-06-15"),
      },
      {
        workerId: worker1.id,
        facilityId: mobileUnit.id,
        type: "Vaccination: Hepatitis B",
        result: "Administered (Dose 2 of 3)",
        date: new Date("2026-04-18"),
      },
      {
        workerId: worker1.id,
        facilityId: perumbavoorCHC.id,
        type: "Random Blood Sugar (Diabetes)",
        result: "98 mg/dL (Normal)",
        date: new Date("2026-06-15"),
      },

      // Worker 2
      {
        workerId: worker2.id,
        facilityId: kozhikodeGH.id,
        type: "Malaria Rapid Diagnostic Test (RDT)",
        result: "Negative (Clear)",
        date: new Date("2026-07-02"),
      },
      {
        workerId: worker2.id,
        facilityId: kozhikodeGH.id,
        type: "Blood Pressure & Hypertension",
        result: "118/78 mmHg (Optimal)",
        date: new Date("2026-07-02"),
      },
      {
        workerId: worker2.id,
        facilityId: kozhikodeGH.id,
        type: "Vaccination: Tetanus Toxoid (TT Booster)",
        result: "Administered (Batch #TT-8832)",
        date: new Date("2026-07-02"),
      },
      {
        workerId: worker2.id,
        facilityId: kozhikodeGH.id,
        type: "Vaccination: COVID-19 Precautionary Dose",
        result: "Administered (Covishield)",
        date: new Date("2026-01-14"),
      },

      // Worker 3
      {
        workerId: worker3.id,
        facilityId: palakkadPHC.id,
        type: "Random Blood Sugar (Diabetes)",
        result: "104 mg/dL (Normal)",
        date: new Date("2026-08-01"),
      },
      {
        workerId: worker3.id,
        facilityId: palakkadPHC.id,
        type: "Heat Strain & Core Electrolyte Panel",
        result: "Mild Dehydration (Recovered)",
        date: new Date("2026-08-01"),
      },
      {
        workerId: worker3.id,
        facilityId: palakkadPHC.id,
        type: "Vaccination: Tetanus Toxoid (TT)",
        result: "Administered (Batch #TT-7102)",
        date: new Date("2026-08-01"),
      },

      // Worker 4
      {
        workerId: worker4.id,
        facilityId: mobileUnit.id,
        type: "Malaria Rapid Diagnostic Test (RDT)",
        result: "Negative (Clear)",
        date: new Date("2026-08-10"),
      },
      {
        workerId: worker4.id,
        facilityId: mobileUnit.id,
        type: "Tuberculosis Screening (Chest X-Ray / Sputum)",
        result: "Clear / Normal",
        date: new Date("2026-08-10"),
      },
      {
        workerId: worker4.id,
        facilityId: mobileUnit.id,
        type: "Vaccination: Tetanus Toxoid (TT Booster)",
        result: "Administered (Batch #TT-9104)",
        date: new Date("2026-08-10"),
      },
    ],
  });

  // 6. Create Treatments
  await prisma.treatment.createMany({
    data: [
      {
        workerId: worker1.id,
        visitId: visit1.id,
        description: "Occupational dust exposure symptomatic relief & protective airway protocol",
        medication: "Cetirizine 10mg OD x 5 days, Salbutamol Inhaler PRN, N95 respirators provided",
        date: new Date("2026-06-15"),
      },
      {
        workerId: worker2.id,
        visitId: visit2.id,
        description: "Prophylactic occupational health multivitamin and iron supplementation",
        medication: "Daily Multivitamin tablet x 30 days, Vitamin D3 60k IU monthly",
        date: new Date("2026-07-02"),
      },
      {
        workerId: worker3.id,
        visitId: visit3.id,
        description: "Oral rehydration and thermal rest protocol for industrial heat exhaustion",
        medication: "Oral Rehydration Salts (ORS) packets x 3 days, Paracetamol 500mg SOS",
        date: new Date("2026-08-01"),
      },
      {
        workerId: worker4.id,
        visitId: visit4.id,
        description: "Preventive eye care and lubrication for concrete dust exposure",
        medication: "Carboxymethylcellulose 0.5% eye drops TDS x 7 days",
        date: new Date("2026-08-10"),
      },
    ],
  });

  console.log("Database seeded successfully with rich Health Passport data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
