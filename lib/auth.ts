import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "migranthealth_default_secret_key_2026",
  pages: {
    signIn: "/login",
  },
  providers: [
    // 1. Staff & Admin Credentials Provider (Email & Password)
    CredentialsProvider({
      id: "credentials",
      name: "Kerala Health Portal Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "provider@keralahealth.gov.in" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { facility: true },
        });

        if (!user) {
          throw new Error("Invalid credentials. User not found.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials. Incorrect password.");
        }

        const normalizedRole = user.role === "STAFF" ? "PROVIDER" : user.role;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: normalizedRole,
          facilityId: user.facilityId,
          facilityName: user.facility?.name || null,
        };
      },
    }),

    // 2. Worker Credentials Provider (Portable Health ID or Phone + 4-digit Security PIN)
    CredentialsProvider({
      id: "worker-credentials",
      name: "Kerala Athidhi Swasthya Worker Authentication",
      credentials: {
        portableHealthId: { label: "Portable Health ID or Phone", type: "text" },
        pin: { label: "Security PIN", type: "password" },
      },
      async authorize(credentials) {
        const query = credentials?.portableHealthId?.trim();
        const pin = credentials?.pin?.trim();

        if (!query) {
          throw new Error("Please enter your Portable Health ID or registered phone number.");
        }

        if (!pin) {
          throw new Error("Please enter your 4-digit Security PIN.");
        }

        // Search for worker by exact portableHealthId or phone
        const worker = await prisma.worker.findFirst({
          where: {
            OR: [
              { portableHealthId: query },
              { portableHealthId: query.toUpperCase() },
              { phone: query },
              { phone: query.replace(/\s+/g, "") },
            ],
          },
        });

        if (!worker) {
          throw new Error(`No worker found matching "${query}". Please check your Health ID.`);
        }

        // Verify PIN: Default/demo PIN is "1234", or last 4 digits of phone if configured
        const validPins = ["1234"];
        if (worker.phone) {
          const digits = worker.phone.replace(/\D/g, "");
          if (digits.length >= 4) {
            validPins.push(digits.slice(-4));
          }
        }

        if (!validPins.includes(pin)) {
          throw new Error("Invalid Security PIN. (Demo default PIN is 1234)");
        }

        return {
          id: worker.id,
          name: worker.name,
          email: `${worker.portableHealthId.toLowerCase()}@worker.keralahealth.gov.in`,
          role: "WORKER",
          workerId: worker.id,
          portableHealthId: worker.portableHealthId,
          facilityId: null,
          facilityName: null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role === "STAFF" ? "PROVIDER" : user.role;
        token.facilityId = user.facilityId;
        token.facilityName = user.facilityName;
        token.workerId = (user as any).workerId || null;
        token.portableHealthId = (user as any).portableHealthId || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role === "STAFF" ? "PROVIDER" : (token.role || "PROVIDER");
        session.user.facilityId = token.facilityId;
        session.user.facilityName = token.facilityName;
        (session.user as any).workerId = token.workerId || null;
        (session.user as any).portableHealthId = token.portableHealthId || null;
      }
      return session;
    },
  },
};

export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}

/**
 * Helper to check role-based authentication in API route handlers.
 * Returns null if authorized, or a NextResponse (401 / 403) if unauthorized.
 */
export async function requireAuth(allowedRoles: string[] = ["PROVIDER", "ADMIN"]) {
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized. Login is required for this action.",
      },
      { status: 401 }
    );
  }

  const userRole = session.user.role === "STAFF" ? "PROVIDER" : session.user.role;
  const effectiveAllowed = allowedRoles.includes("PROVIDER")
    ? [...allowedRoles, "STAFF"]
    : allowedRoles;

  if (!effectiveAllowed.includes(userRole)) {
    return NextResponse.json(
      {
        success: false,
        error: `Forbidden. Role '${userRole}' is not permitted to perform this operation. Allowed: ${allowedRoles.join(", ")}.`,
      },
      { status: 403 }
    );
  }

  return null; // Authorized
}
