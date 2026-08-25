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

## 🔐 Role-Based Authentication (RBAC)

The application uses **NextAuth.js** with a **Credentials Provider** and **JWT Sessions**, enforcing two distinct access tiers:

| Role / Access | Permitted Actions | Login Required? |
| :--- | :--- | :---: |
| **Public / Worker** | Look up health profile by Portable Health ID (`KL-MH-XXXXXX`), view clinical visit logs, screening test results, and prescriptions. | **No** (Public Access) |
| **STAFF** | Register new workers, log clinical visits, record health screenings (TB, Malaria, BP), prescribe treatments/medications. | **Yes** (Credentials Login) |
| **ADMIN** | All STAFF capabilities + registering healthcare facilities (PHCs, CHCs, Mobile Camps) and system administration. | **Yes** (Credentials Login) |

### 🔑 Default Demo Credentials
- **Facility Staff (Medical Officer)**:
  - **Email**: `staff@keralahealth.gov.in`
  - **Password**: `staff123`
  - **Role**: `STAFF` (Linked to Perumbavoor CHC)
- **Directorate Admin**:
  - **Email**: `admin@keralahealth.gov.in`
  - **Password**: `admin123`
  - **Role**: `ADMIN`

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider, JWT Session Strategy, Bcryptjs)
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
│   │   ├── auth/             # NextAuth Route Handler ([...nextauth])
│   │   ├── facilities/route.ts# Facilities list & registration (Admin protected)
│   │   ├── health/route.ts   # System & DB connectivity status
│   │   ├── screenings/route.ts# Diagnostic screenings (Staff / Admin protected)
│   │   ├── treatments/route.ts# Treatment plans (Staff / Admin protected)
│   │   ├── visits/route.ts   # Clinical visits (Staff / Admin protected)
│   │   ├── workers/route.ts  # Worker search (Public) & Worker creation (Staff/Admin)
│   │   └── workers/[id]/route.ts # Full health history (Public) & Update (Staff/Admin)
│   ├── login/page.tsx        # Staff & Admin Login Page with demo quick-fill
│   ├── globals.css           # Tailwind CSS styles & CSS custom properties
│   ├── layout.tsx            # Root layout with Providers & Navigation
│   └── page.tsx              # Public health dashboard & registry overview
├── components/               # Reusable React UI Components
│   ├── Navbar.tsx            # Header with role badge, login/logout, and language info
│   ├── Providers.tsx         # NextAuth SessionProvider wrapper
│   ├── StatCard.tsx          # Metric cards for key health indicators
│   └── WorkerRecordCard.tsx  # Detailed worker profile, visits & screenings card
├── lib/                      # Shared libraries and utilities
│   ├── auth.ts               # NextAuth configuration & requireAuth helper
│   ├── prisma.ts             # Prisma Client singleton
│   └── utils.ts              # Helper functions (date formatting, ID generation)
├── prisma/                   # Prisma ORM Schema and migrations
│   ├── migrations/           # Versioned SQLite migration files
│   ├── schema.prisma         # Data models (User, Worker, Facility, Visit, Screening, Treatment)
│   └── seed.js               # Seed script with realistic Kerala healthcare records & auth users
├── types/                    # TypeScript module augmentations
│   └── next-auth.d.ts        # NextAuth Session & JWT type extensions
├── .env                      # Local environment configuration (DATABASE_URL, NEXTAUTH_SECRET)
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
cd migrant-health
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database & Seed Accounts
```bash
# Run migration on SQLite database (dev.db)
npx prisma migrate dev

# Seed sample workers, facilities, and staff/admin accounts
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
- Browse public worker records at [http://localhost:3000](http://localhost:3000)
- Sign in as Staff or Admin at [http://localhost:3000/login](http://localhost:3000/login)
