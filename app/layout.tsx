import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TugasAkhir - Pemesanan Tiket Bioskop",
  description:
    "Aplikasi pemesanan tiket bioskop modern dengan Next.js, Neon, dan NextAuth.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      {" "}
      {/* <-- Perubahan di sini */}
      <body className={`${inter.className} bg-background text-foreground`}>
        {" "}
        {/* <-- Perubahan di sini */}
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
          </div>
        </AuthProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
