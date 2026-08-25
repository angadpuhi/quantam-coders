const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Kerala MigrantHealth database...");

  // Worker 1: West Bengal worker in Perumbavoor
  const worker1 = await prisma.worker.upsert({
    where: { healthId: "KL-MH-829104" },
    update: {},
    create: {
      healthId: "KL-MH-829104",
      awaazId: "AWZ-2024-99120",
      fullName: "Debabrata Das",
      gender: "Male",
      bloodGroup: "B+",
      phone: "+91 98312 44910",
      stateOfOrigin: "West Bengal",
      nativeLanguage: "Bengali",
      keralaDistrict: "Ernakulam",
      localAddress: "Plywood Colony, Perumbavoor, Ernakulam",
      currentEmployer: "Sunrise Wood Mills",
      occupation: "Plywood Machine Operator",
      emergencyContactName: "Tapan Das (Brother)",
      emergencyContactPhone: "+91 98312 44999",
      allergies: "Penicillin",
      chronicConditions: "Mild Hypertension",
      healthRecords: {
        create: [
          {
            facilityName: "Perumbavoor Community Health Centre",
            doctorName: "Dr. Ananya Nair",
            visitType: "Occupational Health Screening",
            symptoms: "Mild coughing after shift",
            diagnosis: "Dust exposure respiratory checkup - normal spirometry",
            prescription: "Cetirizine 10mg OD x 5 days, N95 respiratory mask prescribed",
            vitalSigns: "BP: 130/85, Pulse: 74, SpO2: 99%, Temp: 98.4F",
            notes: "Advised continuous usage of protective equipment during timber slicing.",
          },
        ],
      },
      vaccinations: {
        create: [
          {
            vaccineName: "Tetanus Toxoid",
            doseNumber: 2,
            administeredAt: "Perumbavoor CHC Mobile Camp",
            batchNumber: "TT-2024-811",
          },
          {
            vaccineName: "COVID-19 Booster",
            doseNumber: 3,
            administeredAt: "Ernakulam General Hospital",
            batchNumber: "CV-2023-909",
          },
        ],
      },
    },
  });

  // Worker 2: Assam worker in Kozhikode
  const worker2 = await prisma.worker.upsert({
    where: { healthId: "KL-MH-654219" },
    update: {},
    create: {
      healthId: "KL-MH-654219",
      awaazId: "AWZ-2025-11029",
      fullName: "Raju Boro",
      gender: "Male",
      bloodGroup: "O+",
      phone: "+91 88765 12093",
      stateOfOrigin: "Assam",
      nativeLanguage: "Assamese",
      keralaDistrict: "Kozhikode",
      localAddress: "Camp Shed 4, Beach Road, Kozhikode",
      currentEmployer: "Malabar Infrastructure Ltd",
      occupation: "Construction Mason",
      emergencyContactName: "Bina Boro (Spouse)",
      emergencyContactPhone: "+91 88765 99981",
      allergies: "None reported",
      chronicConditions: "None",
      healthRecords: {
        create: [
          {
            facilityName: "Kozhikode Beach General Hospital",
            doctorName: "Dr. K. Raghavan",
            visitType: "General Checkup",
            symptoms: "Routine annual screening",
            diagnosis: "Healthy / fit for work",
            prescription: "Multivitamins 30 days",
            vitalSigns: "BP: 118/78, Pulse: 68, SpO2: 99%, Temp: 98.6F",
          },
        ],
      },
      vaccinations: {
        create: [
          {
            vaccineName: "Hepatitis B",
            doseNumber: 1,
            administeredAt: "Kozhikode Port Health Centre",
            batchNumber: "HB-2024-442",
          },
        ],
      },
    },
  });

  // Worker 3: Odisha worker in Palakkad
  const worker3 = await prisma.worker.upsert({
    where: { healthId: "KL-MH-338102" },
    update: {},
    create: {
      healthId: "KL-MH-338102",
      awaazId: "AWZ-2024-55412",
      fullName: "Santosh Mohapatra",
      gender: "Male",
      bloodGroup: "A+",
      phone: "+91 94371 88201",
      stateOfOrigin: "Odisha",
      nativeLanguage: "Odia",
      keralaDistrict: "Palakkad",
      localAddress: "Kanjikode Industrial Area, Palakkad",
      currentEmployer: "Kerala Steel Re-rolling Mills",
      occupation: "Foundry Worker",
      emergencyContactName: "Geeta Mohapatra (Sister)",
      emergencyContactPhone: "+91 94371 00213",
      allergies: "Sulfonamides",
      chronicConditions: "None",
      healthRecords: {
        create: [
          {
            facilityName: "Kanjikode Primary Health Centre",
            doctorName: "Dr. Suresh Kumar",
            visitType: "Heat Exhaustion & Hydration Review",
            symptoms: "Dizziness during high ambient temperature shift",
            diagnosis: "Mild dehydration, electrolyte imbalance",
            prescription: "Oral Rehydration Salts (ORS), adequate rest",
            vitalSigns: "BP: 110/70, Pulse: 82, SpO2: 98%, Temp: 99.1F",
            notes: "Electrolyte replacement provided. Worker advised on hourly hydration intervals.",
          },
        ],
      },
      vaccinations: {
        create: [
          {
            vaccineName: "Tetanus Toxoid",
            doseNumber: 1,
            administeredAt: "Kanjikode PHC",
            batchNumber: "TT-2024-102",
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully with sample migrant health records:", {
    worker1: worker1.healthId,
    worker2: worker2.healthId,
    worker3: worker3.healthId,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
