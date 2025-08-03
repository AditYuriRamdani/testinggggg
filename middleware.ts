// middleware.ts

export { default } from "next-auth/middleware";

// Tentukan route mana yang ingin Anda lindungi
export const config = {
  matcher: [
    "/dashboard/:path*", // Melindungi semua sub-route di bawah /dashboard
  ],
};
