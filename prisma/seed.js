const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Kerala MigrantHealth database with PROVIDER users, multi-district workers, and clinical data...");

  // 1. Create Facilities across Kerala Districts
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

  const tvmDistrictHospital = await prisma.facility.upsert({
    where: { id: "fac-tvm-dh" },
    update: {},
    create: {
      id: "fac-tvm-dh",
      name: "Thiruvananthapuram District Hospital",
      location: "Thiruvananthapuram District, Kerala",
      type: "District Hospital",
    },
  });

  const thrissurTaluk = await prisma.facility.upsert({
    where: { id: "fac-thrissur-th" },
    update: {},
    create: {
      id: "fac-thrissur-th",
      name: "Chalakudy Taluk Headquarters Hospital",
      location: "Thrissur District, Kerala",
      type: "Taluk Hospital",
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

  // 2. Create Healthcare Provider & Admin Users
  const providerPassword = await bcrypt.hash("password123", 10);
  const workerPinHash = await bcrypt.hash("1234", 10); // Demo self-service PIN for all seeded workers
  const adminPassword = await bcrypt.hash("admin123", 10);

  // Healthcare Provider 1 (Primary)
  await prisma.user.upsert({
    where: { email: "provider@keralahealth.gov.in" },
    update: { password: providerPassword, role: "PROVIDER" },
    create: {
      name: "Dr. Ananya Nair (Medical Officer)",
      email: "provider@keralahealth.gov.in",
      password: providerPassword,
      role: "PROVIDER",
      facilityId: perumbavoorCHC.id,
    },
  });

  // Backward compatibility alias for staff email
  await prisma.user.upsert({
    where: { email: "staff@keralahealth.gov.in" },
    update: { password: providerPassword, role: "PROVIDER" },
    create: {
      name: "Dr. Ananya Nair (Medical Officer)",
      email: "staff@keralahealth.gov.in",
      password: providerPassword,
      role: "PROVIDER",
      facilityId: perumbavoorCHC.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@kerala.gov.in" },
    update: { password: providerPassword, role: "PROVIDER" },
    create: {
      name: "Dr. Ananya Nair (Medical Officer)",
      email: "staff@kerala.gov.in",
      password: providerPassword,
      role: "PROVIDER",
      facilityId: perumbavoorCHC.id,
    },
  });

  // Admin User
  await prisma.user.upsert({
    where: { email: "admin@keralahealth.gov.in" },
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      name: "Kerala Health Directorate Admin",
      email: "admin@keralahealth.gov.in",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@kerala.gov.in" },
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      name: "Kerala Health Directorate Admin",
      email: "admin@kerala.gov.in",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // 3. Create Sample Workers across Kerala Districts
  // Worker 1: Ernakulam (GREEN - Stable)
  const worker1 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-829104" },
    update: {
      name: "Debabrata Das",
      dob: new Date("1993-04-12"),
      gender: "Male",
      phone: "+91 98312 44910",
      homeState: "West Bengal",
      district: "Ernakulam",
      currentAddress: "Plywood Colony, Rayonpuram, Perumbavoor, Ernakulam, Kerala",
      riskStatus: "GREEN",
      pin: workerPinHash,
    },
    create: {
      id: "worker-1",
      name: "Debabrata Das",
      dob: new Date("1993-04-12"),
      gender: "Male",
      phone: "+91 98312 44910",
      homeState: "West Bengal",
      district: "Ernakulam",
      currentAddress: "Plywood Colony, Rayonpuram, Perumbavoor, Ernakulam, Kerala",
      portableHealthId: "KL-MH-829104",
      riskStatus: "GREEN",
      pin: workerPinHash,
    },
  });

  // Worker 2: Kozhikode (GREEN - Stable)
  const worker2 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-654219" },
    update: {
      name: "Raju Boro",
      dob: new Date("1998-09-24"),
      gender: "Male",
      phone: "+91 88765 12093",
      homeState: "Assam",
      district: "Kozhikode",
      currentAddress: "Camp Shed 4, Beach Road, Kozhikode, Kerala",
      riskStatus: "GREEN",
      pin: workerPinHash,
    },
    create: {
      id: "worker-2",
      name: "Raju Boro",
      dob: new Date("1998-09-24"),
      gender: "Male",
      phone: "+91 88765 12093",
      homeState: "Assam",
      district: "Kozhikode",
      currentAddress: "Camp Shed 4, Beach Road, Kozhikode, Kerala",
      portableHealthId: "KL-MH-654219",
      riskStatus: "GREEN",
      pin: workerPinHash,
    },
  });

  // Worker 3: Palakkad (YELLOW - Needs Monitoring)
  const worker3 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-338102" },
    update: {
      name: "Santosh Mohapatra",
      dob: new Date("1989-11-05"),
      gender: "Male",
      phone: "+91 94371 88201",
      homeState: "Odisha",
      district: "Palakkad",
      currentAddress: "Kanjikode Industrial Area, Palakkad, Kerala",
      riskStatus: "YELLOW",
      pin: workerPinHash,
    },
    create: {
      id: "worker-3",
      name: "Santosh Mohapatra",
      dob: new Date("1989-11-05"),
      gender: "Male",
      phone: "+91 94371 88201",
      homeState: "Odisha",
      district: "Palakkad",
      currentAddress: "Kanjikode Industrial Area, Palakkad, Kerala",
      portableHealthId: "KL-MH-338102",
      riskStatus: "YELLOW",
      pin: workerPinHash,
    },
  });

  // Worker 4: Ernakulam (RED - Urgent)
  const worker4 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-491084" },
    update: {
      name: "Bikash Mondal",
      dob: new Date("1995-02-18"),
      gender: "Male",
      phone: "+91 97482 30194",
      homeState: "West Bengal",
      district: "Ernakulam",
      currentAddress: "Aluva Construction Camp, Ernakulam, Kerala",
      riskStatus: "RED",
      pin: workerPinHash,
    },
    create: {
      id: "worker-4",
      name: "Bikash Mondal",
      dob: new Date("1995-02-18"),
      gender: "Male",
      phone: "+91 97482 30194",
      homeState: "West Bengal",
      district: "Ernakulam",
      currentAddress: "Aluva Construction Camp, Ernakulam, Kerala",
      portableHealthId: "KL-MH-491084",
      riskStatus: "RED",
      pin: workerPinHash,
    },
  });

  // Worker 5: Thiruvananthapuram (YELLOW - Follow-up needed)
  const worker5 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-712903" },
    update: {
      name: "Amit Kumar Roy",
      dob: new Date("1991-08-14"),
      gender: "Male",
      phone: "+91 98451 99201",
      homeState: "Bihar",
      district: "Thiruvananthapuram",
      currentAddress: "Vizhinjam Port Labour Quarters, Thiruvananthapuram, Kerala",
      riskStatus: "YELLOW",
      pin: workerPinHash,
    },
    create: {
      id: "worker-5",
      name: "Amit Kumar Roy",
      dob: new Date("1991-08-14"),
      gender: "Male",
      phone: "+91 98451 99201",
      homeState: "Bihar",
      district: "Thiruvananthapuram",
      currentAddress: "Vizhinjam Port Labour Quarters, Thiruvananthapuram, Kerala",
      portableHealthId: "KL-MH-712903",
      riskStatus: "YELLOW",
      pin: workerPinHash,
    },
  });

  // Worker 6: Thrissur (GREEN - Stable)
  const worker6 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-552019" },
    update: {
      name: "Sunil Murmu",
      dob: new Date("1994-06-30"),
      gender: "Male",
      phone: "+91 89123 44510",
      homeState: "Jharkhand",
      district: "Thrissur",
      currentAddress: "Kuriachira Timber Depot, Thrissur, Kerala",
      riskStatus: "GREEN",
      pin: workerPinHash,
    },
    create: {
      id: "worker-6",
      name: "Sunil Murmu",
      dob: new Date("1994-06-30"),
      gender: "Male",
      phone: "+91 89123 44510",
      homeState: "Jharkhand",
      district: "Thrissur",
      currentAddress: "Kuriachira Timber Depot, Thrissur, Kerala",
      portableHealthId: "KL-MH-552019",
      riskStatus: "GREEN",
      pin: workerPinHash,
    },
  });

  // Worker 7: Malappuram (GREEN - Stable)
  const worker7 = await prisma.worker.upsert({
    where: { portableHealthId: "KL-MH-910482" },
    update: {
      name: "Pradip Sethi",
      dob: new Date("1997-12-10"),
      gender: "Male",
      phone: "+91 93371 66102",
      homeState: "Odisha",
      district: "Malappuram",
      currentAddress: "Edappal Brick Kiln Colony, Malappuram, Kerala",
      riskStatus: "GREEN",
      pin: workerPinHash,
    },
    create: {
      id: "worker-7",
      name: "Pradip Sethi",
      dob: new Date("1997-12-10"),
      gender: "Male",
      phone: "+91 93371 66102",
      homeState: "Odisha",
      district: "Malappuram",
      currentAddress: "Edappal Brick Kiln Colony, Malappuram, Kerala",
      portableHealthId: "KL-MH-910482",
      riskStatus: "GREEN",
      pin: workerPinHash,
    },
  });

  // 4. Create Visits (including Upcoming Follow-up Appointments)
  await prisma.treatment.deleteMany({});
  await prisma.screening.deleteMany({});
  await prisma.healthCheck.deleteMany({});
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
      notes: "Presented with dizziness and dehydration after high-heat foundry shift. Administered IV fluids and rest. Follow-up hydration monitoring advised.",
    },
  });

  const visit4 = await prisma.visit.create({
    data: {
      id: "visit-4",
      workerId: worker4.id,
      facilityId: mobileUnit.id,
      date: new Date("2026-08-10"),
      notes: "URGENT TRIAGE: Worker presents with severe acute wheezing and occupational cement dust irritation. Nebulization administered. Immediate specialist consultation requested.",
    },
  });

  // UPCOMING APPOINTMENTS / FOLLOW-UPS (Future dates for 2026)
  const upcomingAppointment1 = await prisma.visit.create({
    data: {
      id: "visit-future-1",
      workerId: worker4.id, // Bikash Mondal (RED)
      facilityId: perumbavoorCHC.id,
      date: new Date("2026-08-28T10:00:00"),
      notes: "URGENT SPECIALIST FOLLOW-UP: Pulmonology assessment & Spirometry review following acute bronchospasm. Priority Clinic Room 3.",
    },
  });

  const upcomingAppointment2 = await prisma.visit.create({
    data: {
      id: "visit-future-2",
      workerId: worker3.id, // Santosh Mohapatra (YELLOW)
      facilityId: palakkadPHC.id,
      date: new Date("2026-09-05T09:30:00"),
      notes: "Routine Blood Glucose & Electrolyte Follow-up re-check. Fasting sample requested.",
    },
  });

  const upcomingAppointment3 = await prisma.visit.create({
    data: {
      id: "visit-future-3",
      workerId: worker5.id, // Amit Kumar Roy (YELLOW)
      facilityId: tvmDistrictHospital.id,
      date: new Date("2026-09-12T11:00:00"),
      notes: "Hypertension Stage 1 Medication Review & BP Re-evaluation.",
    },
  });

  // 5. Create Screenings across categories & time for trend analytics
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

      // Worker 3
      {
        workerId: worker3.id,
        facilityId: palakkadPHC.id,
        type: "Random Blood Sugar (Diabetes)",
        result: "135 mg/dL (Borderline / Monitor)",
        date: new Date("2026-08-01"),
      },
      {
        workerId: worker3.id,
        facilityId: palakkadPHC.id,
        type: "Heat Strain & Core Electrolyte Panel",
        result: "Moderate Dehydration (Under Monitoring)",
        date: new Date("2026-08-01"),
      },

      // Worker 4
      {
        workerId: worker4.id,
        facilityId: mobileUnit.id,
        type: "Occupational Spirometry",
        result: "Restricted Airway (FEV1 52% - Urgent Follow-up)",
        date: new Date("2026-08-10"),
      },
      {
        workerId: worker4.id,
        facilityId: mobileUnit.id,
        type: "Tuberculosis Sputum GeneXpert",
        result: "Under Urgent Microbiological Evaluation",
        date: new Date("2026-08-10"),
      },

      // Worker 5
      {
        workerId: worker5.id,
        facilityId: tvmDistrictHospital.id,
        type: "Blood Pressure & Hypertension",
        result: "148/94 mmHg (Stage 1 Hypertension)",
        date: new Date("2026-08-14"),
      },

      // Worker 6
      {
        workerId: worker6.id,
        facilityId: thrissurTaluk.id,
        type: "Tuberculosis Screening (Mantoux & Sputum)",
        result: "Negative (Normal)",
        date: new Date("2026-07-20"),
      },
      {
        workerId: worker6.id,
        facilityId: thrissurTaluk.id,
        type: "Vaccination: Tetanus Toxoid (TT Booster)",
        result: "Administered (Batch #TT-3142)",
        date: new Date("2026-07-20"),
      },

      // Worker 7
      {
        workerId: worker7.id,
        facilityId: perumbavoorCHC.id,
        type: "Malaria Rapid Diagnostic Test (RDT)",
        result: "Negative (Clear)",
        date: new Date("2026-08-05"),
      },
      {
        workerId: worker7.id,
        facilityId: perumbavoorCHC.id,
        type: "Random Blood Sugar (Diabetes)",
        result: "102 mg/dL (Normal)",
        date: new Date("2026-08-05"),
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
        description: "URGENT BRONCHIAL THERAPY: Acute bronchospasm management & corticosteroid inhaler",
        medication: "Budesonide 400mcg + Formoterol 6mcg Inhaler 2 puffs BD, Oral Prednisolone 20mg x 5 days",
        date: new Date("2026-08-10"),
      },
      {
        workerId: worker5.id,
        visitId: null,
        description: "Antihypertensive therapy initiation & low sodium diet counseling",
        medication: "Amlodipine 5mg OD (morning) x 30 days",
        date: new Date("2026-08-14"),
      },
    ],
  });

  console.log("Database seeded successfully with PROVIDER users and multi-district Kerala health records!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
