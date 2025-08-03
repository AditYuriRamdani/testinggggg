import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Menambahkan properti 'role' ke tipe data JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "user" | null; // Izinkan null
  }
}

// Menambahkan properti 'role' ke tipe data Session dan User
declare module "next-auth" {
  interface User extends DefaultUser {
    role: "admin" | "user" | null; // Izinkan null
  }

  interface Session {
    user: {
      id: string;
      role: "admin" | "user" | null; // Izinkan null
    } & DefaultSession["user"];
  }
}
