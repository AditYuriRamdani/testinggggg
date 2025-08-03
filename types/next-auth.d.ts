import "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Menambahkan properti kustom ke JWT */
  interface JWT {
    id: string;
    role?: "admin" | "user";
  }
}

declare module "next-auth" {
  /** Menambahkan properti kustom ke User */
  interface User {
    role?: "admin" | "user";
  }
  /** Menambahkan properti kustom ke Session */
  interface Session {
    user: {
      id: string;
      role?: "admin" | "user";
    } & User;
  }
}
