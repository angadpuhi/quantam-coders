import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STAFF" | "PROVIDER" | "ADMIN" | "WORKER" | string;
      facilityId?: string | null;
      facilityName?: string | null;
      workerId?: string | null;
      portableHealthId?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "STAFF" | "PROVIDER" | "ADMIN" | "WORKER" | string;
    facilityId?: string | null;
    facilityName?: string | null;
    workerId?: string | null;
    portableHealthId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "STAFF" | "PROVIDER" | "ADMIN" | "WORKER" | string;
    facilityId?: string | null;
    facilityName?: string | null;
    workerId?: string | null;
    portableHealthId?: string | null;
  }
}
