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
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role === "STAFF" ? "PROVIDER" : user.role;
        token.facilityId = user.facilityId;
        token.facilityName = user.facilityName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role === "STAFF" ? "PROVIDER" : (token.role || "PROVIDER");
        session.user.facilityId = token.facilityId;
        session.user.facilityName = token.facilityName;
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
