import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STAFF" | "ADMIN" | string;
      facilityId?: string | null;
      facilityName?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "STAFF" | "ADMIN" | string;
    facilityId?: string | null;
    facilityName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "STAFF" | "ADMIN" | string;
    facilityId?: string | null;
    facilityName?: string | null;
  }
}
