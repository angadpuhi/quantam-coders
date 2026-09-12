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
    CredentialsProvider({
      id: "provider-credentials",
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
    CredentialsProvider({
      id: "worker-credentials",
      name: "Worker Health ID Login",
      credentials: {
        portableHealthId: { label: "Portable Health ID or Phone", type: "text" },
        pin: { label: "Security PIN", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.portableHealthId?.trim();
        const pin = credentials?.pin?.trim();

        if (!identifier || !pin) {
          throw new Error("Please provide your Health ID and PIN.");
        }

        const worker = await prisma.worker.findFirst({
          where: {
            OR: [
              { portableHealthId: identifier },
              { portableHealthId: identifier.toUpperCase() },
              { phone: identifier },
              { phone: identifier.replace(/\s+/g, "") },
            ],
          },
        });

        if (!worker) {
          throw new Error("No worker record found for that Health ID or phone number.");
        }

        // If worker has a hashed pin in DB, verify using bcrypt.
        // Fallback for demo convenience: if worker.pin is not set, allow demo "1234".
        let isPinValid = false;
        if (worker.pin) {
          isPinValid = await bcrypt.compare(pin, worker.pin);
        } else if (pin === "1234") {
          isPinValid = true;
        }

        if (!isPinValid) {
          throw new Error("Incorrect PIN.");
        }

        return {
          id: worker.id,
          name: worker.name,
          email: "",
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
        const rawRole = (user as any).role;
        token.id = user.id;
        token.role = rawRole === "STAFF" ? "PROVIDER" : rawRole;
        token.facilityId = (user as any).facilityId ?? null;
        token.facilityName = (user as any).facilityName ?? null;
        token.workerId = (user as any).workerId ?? null;
        token.portableHealthId = (user as any).portableHealthId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role === "STAFF" ? "PROVIDER" : (token.role || "PROVIDER");
        session.user.facilityId = (token.facilityId as string) ?? null;
        session.user.facilityName = (token.facilityName as string) ?? null;
        (session.user as any).workerId = (token as any).workerId ?? null;
        (session.user as any).portableHealthId = (token as any).portableHealthId ?? null;
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
        error: "Unauthorized. Healthcare Provider or Admin login is required for this action.",
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

/**
 * Loads the current session and, for API routes that expose a single worker's
 * data, enforces that either:
 *  - the caller is a PROVIDER/ADMIN (staff can see any worker), or
 *  - the caller is a WORKER whose own workerId matches the requested worker.
 *
 * `workerMatch` should be the worker's internal id AND/OR portableHealthId,
 * since routes accept either as the URL param. Returns null if authorized,
 * otherwise a NextResponse to return immediately.
 */
export async function requireOwnWorkerOrStaff(workerMatch: {
  id?: string | null;
  portableHealthId?: string | null;
}) {
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please log in to view this record." },
      { status: 401 }
    );
  }

  const role = session.user.role === "STAFF" ? "PROVIDER" : session.user.role;

  if (role === "PROVIDER" || role === "ADMIN") {
    return null;
  }

  if (role === "WORKER") {
    const sessionWorkerId = (session.user as any).workerId as string | null;
    const sessionHealthId = (session.user as any).portableHealthId as string | null;
    const matches =
      (workerMatch.id && sessionWorkerId && workerMatch.id === sessionWorkerId) ||
      (workerMatch.portableHealthId &&
        sessionHealthId &&
        workerMatch.portableHealthId.toUpperCase() === sessionHealthId.toUpperCase());

    if (matches) return null;

    return NextResponse.json(
      { success: false, error: "Forbidden. You can only view your own health record." },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { success: false, error: "Forbidden. Unrecognized role." },
    { status: 403 }
  );
}
