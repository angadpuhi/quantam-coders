# MigrantHealth 🏥🌴

**MigrantHealth** is a full-stack Digital Health Record Management System designed specifically for migrant and guest workers (*Athidhi Thozhilalikal*) in Kerala, India.

---

## 📌 Problem Statement & Overview

Kerala hosts over 3 million inter-state migrant workers employed in construction, plywood manufacturing, textile mills, agriculture, and hospitality. Key challenges faced by this community include:
- **Language Barriers**: Inter-state workers predominantly speak Hindi, Bengali, Assamese, or Odia, making communication with local healthcare providers difficult.
- **Fragmented Medical History**: High mobility across districts (e.g., Perumbavoor in Ernakulam, Kozhikode, Palakkad, Trivandrum) results in loss of paper records, duplicate screenings, and delayed interventions.
- **Occupational Health Hazards**: Exposure to chemical fumes, industrial dust, and physical risks requires continuous occupational monitoring.
- **Scheme Utilization**: Need for streamlined linkage with Kerala Government's **Awaaz Health Insurance Scheme** and local Primary Healthcare Centres (PHCs) / Community Healthcare Centres (CHCs).

**MigrantHealth** provides a unified, portable, and multilingual health registry that enables seamless health record tracking, screening logs, and clinical treatments across all 14 districts of Kerala.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with **SQLite** for local development (production-ready for PostgreSQL / MySQL)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Directory Structure

```
migrant-health/
├── app/                      # Next.js App Router (Layouts, Pages, API endpoints)
│   ├── api/
│   │   ├── facilities/route.ts# Facilities list & registration
│   │   ├── health/route.ts   # System & DB connectivity status
│   │   ├── screenings/route.ts# Diagnostic & screening logs (POST / GET)
│   │   ├── treatments/route.ts# Treatment plans & prescriptions (POST / GET)
│   │   ├── visits/route.ts   # Clinical visits (POST / GET)
│   │   ├── workers/route.ts  # Worker registry & portable ID search (POST / GET)
│   │   └── workers/[id]/route.ts # Full worker health history by ID or portableHealthId
│   ├── globals.css           # Tailwind CSS styles & CSS custom properties
│   ├── layout.tsx            # Root layout with navigation & meta tags
│   └── page.tsx              # Public health dashboard & registry overview
├── components/               # Reusable React UI Components
│   ├── Navbar.tsx            # Header with language indicator & portal branding
│   ├── StatCard.tsx          # Metric cards for key health indicators
│   └── WorkerRecordCard.tsx  # Detailed worker profile, visits & screenings card
├── lib/                      # Shared libraries and utilities
│   ├── prisma.ts             # Prisma Client singleton
│   └── utils.ts              # Helper functions (date formatting, ID generation)
├── prisma/                   # Prisma ORM Schema and migrations
│   ├── migrations/           # Versioned SQLite migration files
│   ├── schema.prisma         # Data models (Worker, Facility, Visit, Screening, Treatment)
│   └── seed.js               # Seed script with realistic Kerala healthcare records
├── .env                      # Local environment configuration (DATABASE_URL)
├── .env.example              # Example environment configuration
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies & scripts
├── tsconfig.json             # TypeScript configuration & path aliases
└── README.md                 # Project documentation
```

---

## 🛠️ Getting Started

### 1. Navigate to Project
```bash
cd migrant-health
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database & Apply Migrations
```bash
# Run migration on SQLite database (dev.db)
npx prisma migrate dev

# Seed sample data (Facilities, Workers, Visits, Screenings, Treatments)
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 REST API Documentation

### 1. Workers Registry (`/api/workers`)
- **`GET /api/workers`**: Fetch all workers or search.
  - Query parameters:
    - `?portableHealthId=KL-MH-829104` (exact portable health ID lookup)
    - `?q=Debabrata` (fuzzy search across name, home state, address, phone)
- **`POST /api/workers`**: Register a new worker.
  - Payload:
    ```json
    {
      "name": "Bikash Mondal",
      "gender": "Male",
      "homeState": "West Bengal",
      "phone": "+91 97321 00192",
      "currentAddress": "Kalamassery, Ernakulam, Kerala",
      "dob": "1995-11-20",
      "portableHealthId": "KL-MH-829104" // Optional: auto-generated if omitted
    }
    ```
  - Responses: `201 Created`, `400 Bad Request` (missing required fields), `409 Conflict` (duplicate `portableHealthId`).

### 2. Full Worker Health History (`/api/workers/[id]`)
- **`GET /api/workers/[id]`**: Retrieve complete health history by database ID or `portableHealthId`.
  - Returns complete worker profile, visits with facility details, diagnostic screenings, treatments, and aggregated clinical summary.
  - Responses: `200 OK`, `404 Not Found`.
- **`PUT /api/workers/[id]`**: Update worker demographics.

### 3. Clinical Visits (`/api/visits`)
- **`GET /api/visits`**: List visits (filterable by `?workerId=`, `?portableHealthId=`, `?facilityId=`).
- **`POST /api/visits`**: Record a visit.
  - Payload:
    ```json
    {
      "portableHealthId": "KL-MH-829104",
      "facilityId": "fac-perumbavoor-chc",
      "date": "2026-08-25T09:00:00Z",
      "notes": "Routine checkup and respiratory screening."
    }
    ```

### 4. Diagnostic Screenings (`/api/screenings`)
- **`GET /api/screenings`**: List screenings (filterable by `?workerId=`, `?portableHealthId=`, `?facilityId=`, `?type=`).
- **`POST /api/screenings`**: Record a screening.
  - Payload:
    ```json
    {
      "portableHealthId": "KL-MH-829104",
      "facilityId": "fac-perumbavoor-chc",
      "type": "Tuberculosis Screening (Mantoux)",
      "result": "Negative"
    }
    ```

### 5. Treatment Plans & Prescriptions (`/api/treatments`)
- **`GET /api/treatments`**: List treatments.
- **`POST /api/treatments`**: Record treatment or prescription.
  - Payload:
    ```json
    {
      "portableHealthId": "KL-MH-829104",
      "visitId": "visit-1", // Optional
      "description": "Symptomatic treatment for seasonal dust allergy",
      "medication": "Cetirizine 10mg OD x 5 days"
    }
    ```

### 6. Facilities & Health Status
- **`GET /api/facilities`**: List all connected PHCs, CHCs, and mobile camps.
- **`POST /api/facilities`**: Register a healthcare facility.
- **`GET /api/health`**: Real-time service health check and database statistics.
