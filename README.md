# MigrantHealth 🏥🌴

**MigrantHealth** is a full-stack Digital Health Record Management System designed specifically for migrant and guest workers (*Athidhi Thozhilalikal*) in Kerala, India.

---

## 📌 Problem Statement & Overview

Kerala hosts over 3 million inter-state migrant workers employed in construction, plywood manufacturing, textile mills, agriculture, and hospitality. Key challenges faced by this community include:
- **Language Barriers**: Inter-state workers predominantly speak Hindi, Bengali, Assamese, or Odia, making communication with local healthcare providers difficult.
- **Fragmented Medical History**: High mobility across districts (e.g., Perumbavoor in Ernakulam, Kozhikode, Palakkad, Trivandrum) results in loss of paper records, duplicate screenings, and delayed interventions.
- **Occupational Health Hazards**: Exposure to chemical fumes, industrial dust, and physical risks requires continuous occupational monitoring.
- **Scheme Utilization**: Need for streamlined linkage with Kerala Government's **Awaaz Health Insurance Scheme** and local Primary Healthcare Centres (PHCs) / Community Healthcare Centres (CHCs).

**MigrantHealth** provides a unified, portable, and multilingual health registry that enables seamless health record tracking, vaccination history management, occupational screening logs, and rapid emergency contact access across all 14 districts of Kerala.

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
│   │   ├── health/route.ts   # System & DB connectivity status
│   │   └── workers/route.ts  # Worker registry REST API (GET, POST)
│   ├── globals.css           # Tailwind CSS styles & CSS custom properties
│   ├── layout.tsx            # Root layout with navigation & meta tags
│   └── page.tsx              # Public health dashboard & registry overview
├── components/               # Reusable React UI Components
│   ├── Navbar.tsx            # Header with language indicator & portal branding
│   ├── StatCard.tsx          # Metric cards for key health indicators
│   └── WorkerRecordCard.tsx  # Detailed worker profile & clinical history card
├── lib/                      # Shared libraries and utilities
│   ├── prisma.ts             # Prisma Client singleton
│   └── utils.ts              # Helper functions (date formatting, ID generation)
├── prisma/                   # Prisma ORM Schema and migrations
│   └── schema.prisma         # Data models (Worker, HealthRecord, Vaccination)
├── .env                      # Local environment configuration (DATABASE_URL)
├── .env.example              # Example environment configuration
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies & scripts
├── tsconfig.json             # TypeScript configuration & path aliases
└── README.md                 # Project documentation
```

---

## 🛠️ Getting Started

### 1. Clone & Navigate
```bash
git clone <repo-url>
cd migrant-health
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database (Prisma + SQLite)
Initialize the SQLite database with the Prisma schema:
```bash
# Push schema to SQLite database (dev.db)
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🗄️ Database Models (Prisma)

- **`Worker`**: Core registry holding demographic details (Unique Health ID, Kerala Awaaz ID, Name, State of Origin, Native Language, Kerala District, Employer, Emergency Contacts, Chronic Conditions & Allergies).
- **`HealthRecord`**: Clinical checkup logs, symptoms, diagnoses, prescriptions, vitals, and PHC/CHC facility references.
- **`Vaccination`**: Immunization records (Tetanus Toxoid, Hepatitis B, COVID-19, etc.), dose sequence numbers, batch IDs, and due dates.

---

## 🌐 API Reference

### Health Check
- `GET /api/health` — Check server and database status.

### Workers Registry
- `GET /api/workers` — Retrieve all worker records (supports query param `?q=` for searching by name, Health ID, phone, or district).
- `POST /api/workers` — Register a new migrant worker profile.

---

## 🏛️ Kerala District Coverage
Key hubs targeted for rollout:
- **Ernakulam** (Perumbavoor, Aluva, Kalamassery industrial belts)
- **Kozhikode** (Construction & port logistics)
- **Palakkad** (Kanjikode industrial cluster)
- **Thiruvananthapuram** (Infrastructure & urban development)
- **Wayanad & Idukki** (Plantation sectors)
